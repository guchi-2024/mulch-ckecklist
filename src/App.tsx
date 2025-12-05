// import './App.css'
import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from "react-router-dom"
import Home from "./pages/Home"
import NoMatch from "./pages/NoMatch"
import AppLayout from "./components/layout/AppLayout"
import { ThemeProvider } from "@emotion/react"
import { CssBaseline } from "@mui/material"
import { theme } from "./theme/theme"
import CheckListLayout from "./components/layout/CheckListLayout"
import { useCallback, useEffect, useState } from "react"
import { Flight, FlightShip, ListItems, MenuList, TransferRecord } from "./types/index"
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, updateDoc, where, writeBatch } from "firebase/firestore"
import { db } from "./firebase"
import { addItemSchemaTs, addPositionSchemaTs, editItemSchemaTs, editPositionSchemaTs } from "./validations/schema"
import FlightList from "./pages/FlightList"
import PersonalRecord from "./pages/PersonalRecord"
import { set } from "react-hook-form"



export interface AreaCheckStatus {
  [arr: string]: {
    [shipName: string]: {
      [areaName: string]: {
        total: number;
        checked: number;
      };
    };
  }  
}
export interface CheckedItemByARR {
  [arr: string]: string[];
}

const LOCAL_STORAGE_KEY = "checkedItems"; // Local Storageのキーを定数として定義
const COMPLETED_ARRS_STORAGE_KEY = "completedARRs"; // Local Storageのキーを定数として定義


function App() {

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const[listItems, setListItems] = useState<ListItems[]>([]);
  const[isSetting, setIsSetting] = useState(false);
  const[isAdd, setIsAdd] = useState(false);
  const[isDefaultEntry, setIsDefaultEntry] = useState(false); 
  const[isPersonalRecord, setIsPersonalRecord] = useState(false);
  const[isDelete, setIsDelete] = useState(false);
  const[isEdit, setIsEdit] = useState(false);
  const[settingFormShip, setSettingFormShip] = useState("");
  const[settingFormArea, setSettingFormArea] = useState("");
  const[settingFormPosition, setSettingFormPosition] = useState("");
  const[oldPosition, setOldPosition] = useState('');
  const[oldArea, setOldArea] = useState('');
  const[message, setMessage] = useState('');
  const[targetItemId, setTargetItemId] = useState<string | null> (null);
  const[targetPositionToDelete, setTargetPositionToDelete] = useState<string | null>(null);
  const[targetAreaToDelete, setTargetAreaToDelete] = useState<string | null>(null);
  const[targetShipToDelete, setTargetShipToDelete] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<CheckedItemByARR>(() => {
    try {
      const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedItems ? JSON.parse(storedItems) : [];
    } catch(error) {
      console.error("Failed to load checked items from local storage:", error);
      return {};
    }
  });
  const [currentARR, setCurrentARR] = useState<string | null>(null);
  const [areaCheckStatus, setAreaCheckStatus] = useState<AreaCheckStatus>({});
  const [flightList, setFlightList] = useState<Flight[]>([]);
  const [isCopying, setIsCopying] = useState(false);
  const [draftDefaultFlight, setDraftDefaultFlight] = useState<Flight[]>([]);
  const [completedARRs, setCompletedARRs] = useState<string[]>(() => {
    try {
      const storedARRs = localStorage.getItem(COMPLETED_ARRS_STORAGE_KEY);
      const parsed = storedARRs ? JSON.parse(storedARRs) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch(error) {
      console.error("Failed to load completed ARRs from local storage:", error);
      return [];
    }
  }); 
  const[transferRecordDatas, setTransferRecordDatas] = useState<TransferRecord[]>([]);
  

// 日時設定 *******************************************************
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 3600000);  //1秒単位（1000）で設定するとサイレンダリングが頻繁に行われるので1分単位に設定
    return () => {
      clearInterval(timer);
    }
  }, []);

  // 日付と時刻のフォーマット関数
  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月は0から始まるため+1
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}/${month}/${day}　${hours}:${minutes}`;
  };
  // padStart(2, '0')とは数字を2桁に揃える。例: 1→01


  // checkedItemsが変更されるたびにLocal Storageに保存 ******************************
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(checkedItems));
    } catch(error) {
      console.error("Failed to save checked items to local storage:", error);
    }
  }, [checkedItems]);

  // completedARRsが変更されるたびにLocal Storageに保存 ******************************
  useEffect(() => {
    try {
      localStorage.setItem(COMPLETED_ARRS_STORAGE_KEY, JSON.stringify(completedARRs));
    } catch(error) {
      console.error("Failed to save completed ARRs to local storage:", error);
    }
  }, [completedARRs]);

  
  
  // Firestoreエラーかどうかを判定する型ガード****************************
  function isFireStoreError(error: unknown):error is {code: string, message: string} {
    return typeof error === "object" && error !== null && "code" in error
  }

  // Firestoreからデータを取得し、チェック状態を計算する**********************************
  useEffect(() => {
    const collectionRef = collection(db, "checklistItem");

    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const itemData = querySnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        } as ListItems;
      });
      console.log("Realtime itemData:", itemData);
      setListItems(itemData);

      // エリアごとの合計数を計算（チェック数は後でローカルstateで処理)
      if(!isSetting && currentARR){
      setAreaCheckStatus(prevAreaCheckStatus => { 
      const newAreaCheckStatus: AreaCheckStatus = {...prevAreaCheckStatus};
      newAreaCheckStatus[currentARR] = {};

      itemData.forEach(item => {
        if (!newAreaCheckStatus[currentARR][item.ship]) {
          newAreaCheckStatus[currentARR][item.ship] ={};
        }
        if (!newAreaCheckStatus[currentARR][item.ship][item.area]) {
          newAreaCheckStatus[currentARR][item.ship][item.area] = { total:0, checked:0};
        }
        newAreaCheckStatus[currentARR][item.ship][item.area].total++;
      });
      // setAreaCheckStatus(newAreaCheckStatus);
      return newAreaCheckStatus;
      });
      }

    }, (error) => {
      if(isFireStoreError(error)) {
        console.log("Firestorリアルタイムリスナーエラー: ", error.code, error.message)
      } else {
        console.error("一般的なリアルタイムリスナーエラー:", error)
      }
    });
    return () => unsubscribe();
  }, []);
  console.log("areaCheckStatus: ",areaCheckStatus)

  // checkedItems または listItems が変更されたときに areaCheckStatus の checked 数を更新
  useEffect(() => {
   // checkedItems[currentARR] に基づいてチェック数を再計算
   if (!isSetting && currentARR && listItems.length > 0) {
    setAreaCheckStatus(prevAreaCheckStatus => {
      const newAreaCheckStatus: AreaCheckStatus = { ...prevAreaCheckStatus };
      newAreaCheckStatus[currentARR] = {};
      
      // total数を計算
      listItems.forEach(item => {
        if (!newAreaCheckStatus[currentARR][item.ship]) {
          newAreaCheckStatus[currentARR][item.ship] = {};
        }
        if (!newAreaCheckStatus[currentARR][item.ship][item.area]) {
          newAreaCheckStatus[currentARR][item.ship][item.area] = { total: 0, checked: 0 };
        }
        newAreaCheckStatus[currentARR][item.ship][item.area].total++;
      });

    // checkedItems[currentARR] に基づいてチェック数を再計算
    const arrItems = checkedItems[currentARR] || [];
    if (Array.isArray(arrItems)) {
      arrItems.forEach(checkedItemId => {
        const item = listItems.find(li => li.id === checkedItemId);
        if (item && newAreaCheckStatus[currentARR]?.[item.ship]?.[item.area]) {
          newAreaCheckStatus[currentARR][item.ship][item.area].checked++;
        }
      });
    }
      return newAreaCheckStatus;
    });
    }
  }, [checkedItems, listItems, isSetting, currentARR]);  

  console.log("Current listItems state:", listItems);
  console.log("Current checkedItems state:", checkedItems);
  console.log("Current areaCheckStatus state:", areaCheckStatus);


  // アイテムのチェック状態をローカルで更新する関数
  const handleToggleItem = useCallback((itemId: string, arr: string) => {
    if(!isSetting) {
      setCheckedItems((prevCheckedItems) => {
        const arrItems = prevCheckedItems[arr] || [];
        const currentIndex = arrItems.indexOf(itemId);
        if (currentIndex === -1) {
          return {
            ...prevCheckedItems, 
            [arr]: [...arrItems, itemId]
          }
  
        } else {
          const newArrItems = [...arrItems];
          newArrItems.splice(currentIndex, 1);
          return {
            ...prevCheckedItems,
            [arr]: newArrItems
          }
        }
      })
   }
  }, [isSetting]);


// defaultFlightsをcurrentFlightsにコピー **********************************
// 前回のcurrentFlightsを一度削除してdefaultFlightsをcurrentFlightsにコピーする
  const handleCopy = async () => {
    setIsCopying(true);
    setMessage('削除を開始します');
    try {
      // 1. currentFlights コレクションの全ドキュメントを取得
      const currentFlightsRef = collection(db, 'currentFlights');
      const querySnapshot = await getDocs(currentFlightsRef);

      if(querySnapshot.empty) {
        setMessage('currentFlightsに削除するドキュメントがありませんでした。')
        setIsCopying(false);
        return;
      }
      // 2. 取得した各ドキュメントをループ処理し、個別に削除
      for (const flightDoc of querySnapshot.docs) {
        await deleteDoc(doc(db, 'currentFlights', flightDoc.id));
      }
      setMessage('すべてのフライト情報を currentFlights から削除しました！')
    } catch (error) {
      console.error('削除中にエラーが発生しました:', error);
      setMessage('削除中にエラーが発生しました。');

    } finally {
      setIsCopying(false);
    }

    setIsCopying(true);
    setMessage('コピーを開始します');
    try {
      // 1. defaultFlights コレクションから全ドキュメントを取得
      const defaultFlightsRef = collection(db, 'defaultFlights');
      const querySnapshot = await getDocs(defaultFlightsRef);

      if(querySnapshot.empty) {
        setMessage('defaultFlightsにコピーするドキュメントがありませんでした。')
        setIsCopying(false);
        return;
      }

      for (const doc of querySnapshot.docs) {
        // 3. currentFlights コレクションに新しいドキュメントとして書き込む
        const data = doc.data();
        await addDoc(collection(db, 'currentFlights'), data);
      }
      setMessage('すべてのフライト情報を currentFlights にコピーしました！') 
    } catch (error) {
      console.error('コピー中にエラーが発生しました:', error);
      setMessage('コピー中にエラーが発生しました。');
    } finally {
      setIsCopying(false);
    }
  };
  
// firestoreのcurrentFlightsからフライトデータを全て取得***********************************

useEffect(() => {
  
  const collectionRef = collection(db, "currentFlights");
  const q = query(collectionRef, orderBy("No", "asc"));
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const flightData = querySnapshot.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      } as Flight;
    });

    console.log("Realtime flightData:", flightData);
    setFlightList(flightData);
    

  }, (error) => {
    if(isFireStoreError(error)) {
      console.log("Firestore リアルタイムリスナーエラー:", error.code, error.message)
    } else {
      console.error("一般的なリアルタイムリスナーエラー:", error)
    }
  });
  
  return () => unsubscribe();
},[]);
console.log("Current flightList state:", flightList);

// firestoreのdefaultFlightsからフライトデータを全て取得***********************************

useEffect(() => {
  
  const collectionRef = collection(db, "defaultFlights");
  const q = query(collectionRef, orderBy("No", "asc"));
  
  const subscribe = onSnapshot(q, (querySnapshot) => {
    const flightData = querySnapshot.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      } as Flight;
    });

    console.log("Realtime flightData:", flightData);
    setDraftDefaultFlight(flightData);
    

  }, (error) => {
    if(isFireStoreError(error)) {
      console.log("Firestore リアルタイムリスナーエラー:", error.code, error.message)
    } else {
      console.error("一般的なリアルタイムリスナーエラー:", error)
    }
  });
  
  return () => subscribe();
},[]);
console.log("draftDefaultFlight state:", draftDefaultFlight);



// FirestoreのcurrentFlightsコレクションのドキュメントを更新と追加******************

const handleUpdateFlightInfo = async (updatedFlight: Flight, collectionName: string) => {
  if(updatedFlight.id) { 
    // 既存のドキュメントを更新(idあり)
    try {
      const flightDocRef = doc(db, collectionName, updatedFlight.id);
      // Firestoreに保存するデータからidを除外
      const { id, ...updateData } = updatedFlight;
      await updateDoc(flightDocRef, updateData);
      console.log("Flight info updated successfully");
    } catch (error) {
      console.error("Error updating flight document in Firestore:", error)
    }
  } else {
    // 新しいドキュメントを追加(idなし)
    try {
    const { id, ...addData } = updatedFlight;
    const dataToAdd = { ...addData };
    // Companyに基づいてNoのデフォルト値を設定
    switch (dataToAdd.company) {
      case "JAL":
        dataToAdd.No = 100;
        break;
      case "JAIR":
        dataToAdd.No = 200;
        break;
      case "JAC":
        dataToAdd.No = 300;
        break;
      default:
        dataToAdd.No = 0; // 上記以外のcompanyの場合のデフォルト値
        console.warn(`Unknown company: ${dataToAdd.company}. Setting No to 0.`);
        break;
    }
    const dogRef = await addDoc(collection(db, collectionName), dataToAdd);
    console.log("New flight info added successfully with ID:", dogRef.id);
    
    } catch (error) {
      console.error("Error adding new flight document to Firestore:", error);
    }
  }
}

console.log("Current flightList state:", flightList);

// FlightをFirestoreから削除する****************************

const handleDeleteFlight = async (flightId: string, collectionName: string) => {
  if(!flightId) {
    console.error("Flight ID is required to delete.")
    setMessage("削除するフライトが選択されていません。");
    return;
  }
  setMessage("削除処理を実行...")
  try {
    const flightDocRef = doc(db, collectionName, flightId);
    await deleteDoc(flightDocRef);
    console.log("Flight deleted successfully")
    // ローカルステートから削除されたフライトを除外する
    setFlightList((prevFlightList) => prevFlightList.filter((flight) => flight.id !== flightId));
    setMessage(`フライト（ID: ${flightId}）を削除しました。`);
  } catch (error) {
    console.error("Error deleting flight document from Firestore:", error);
    setMessage("削除中にエラーが発生しました。");
    if(isFireStoreError(error)) {
      console.log("Firestore エラーコード:", error.code, "メッセージ:", error.message);
    }
  }
}

// 全てのリストのチェックが完了したら、履歴カレンダーに反映させる。　**************************

const flightListCount = flightList.length;
console.log("flightListCount:", flightListCount);

const completedARRsCount = completedARRs.length;
console.log("completedARRsCount:", completedARRsCount);




// 型を一致させるため、fireStoreの配列の形式をFlightListの配列の形式に変更する。**************
const convertToFlightShip = (flights: Flight[]): FlightShip[] => {
  const flightShipsMap: Map<string, FlightShip> = new Map();

  for (const flight of flights) {
    if (!flight.company) {
      continue;
    }

    if (!flightShipsMap.has(flight.company)) {
      flightShipsMap.set(flight.company, {
        company: flight.company,
        flights: [],
      });
    }

    const flightShip = flightShipsMap.get(flight.company);
    if (flightShip) {
      flightShip.flights.push({
        No: flight.No,
        id: flight.id,
        ARR: flight.ARR,
        DEP: flight.DEP,
        ship: flight.ship,
        shipNo: flight.shipNo,
      });
    }
  }

  return Array.from(flightShipsMap.values());
};

const currentFlights = convertToFlightShip(flightList)
console.log("currentFlights:", currentFlights);
const defaultFlights = convertToFlightShip(draftDefaultFlight)
console.log("defaultFlights:", defaultFlights);

// setDefaultFlights(convertToFlightShip(draftDefaultFlight));



 
  // firestoreからアイテムデータを全て取り出してlistItemsに収納***********************************
  useEffect(() => {

    const collectionRef = collection(db, "checklistItem");
    
    const subscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const itemData = querySnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        } as ListItems;
      });

      console.log("Realtime itemData:", itemData);
      setListItems(itemData);   

    }, (error) => {
      if(isFireStoreError(error)) {
        console.log("Firestore リアルタイムリスナーエラー:", error.code, error.message)
      } else {
        console.error("一般的なリアルタイムリスナーエラー:", error)
      }
    });
    
    return () => subscribe();
  },[]);
  
  console.log("Current listItems state:", listItems);

  // 追加処理
  
  // 追加したposition名をfirestoreに保存
  const handleSaveAddPosition = async(addPosition: addPositionSchemaTs) => {
    try{
      //  firestoreにデータを保存
      const addPositionData = {
        ship: settingFormShip,
        area: settingFormArea,
        position: addPosition.position,
        name: "noName",
        number: 0,
        startDate: "2025-01-01",
        endDate: "2100-01-01"
      }
      const docRef = await addDoc(collection(db, "checklistItem"), addPositionData);
      console.log("Document written with ID: ", docRef.id);


    } catch(error) {
      if(isFireStoreError(error)) {
        console.log("firestoreによるエラー:",error)
      } else {
        console.error("一般的なエラー:",error)
      }
    }
  };

  // 追加したItem名およびItemの内容をfirestoreに保存
  const handleSaveAddItem = async(addItem: addItemSchemaTs) => {
    try{
      //  firestoreにデータを保存
      const addItemData = {
        ship: settingFormShip,
        area: settingFormArea,
        position: settingFormPosition,
        name: addItem.item,
        number: addItem.number,
        startDate: addItem.startDate,
        endDate: addItem.endDate
      }
      const docRef = await addDoc(collection(db, "checklistItem"), addItemData);
      console.log("Document written with ID: ", docRef.id);


    } catch(error) {
      if(isFireStoreError(error)) {
        console.log("firestoreによるエラー:",error)
      } else {
        console.error("一般的なエラー:",error)
      }
    }
  };
  console.log("settingFormShip:", settingFormShip)
  console.log("settingFormArea:", settingFormArea)
  console.log("settingFormPosition:", settingFormPosition)

  // position更新処理

  const HandleUpdatePosition = async(
    editPositon: editPositionSchemaTs,
    targetShip: string,
    targetOldArea: string
   
    ) => {
    setMessage("更新中");
    // if(!oldPosition || !editPositon.position) {
    //   setMessage("古いPositionと新しいPositionを入力してください。");
    //   return;
    // }
    const batch = writeBatch(db);
    const checkListItemsRef = collection(db, 'checklistItem');

    console.log("editPositon.position:", editPositon.position);

    console.log("oldPosition (古いPosition):", oldPosition);
    console.log("Type of oldPosition:", typeof oldPosition);
    console.log("checkListItemsRef", checkListItemsRef);
    console.log("targetShip:", targetShip); 
    console.log("targetArea:", targetOldArea); 



    try {
      const q = query(checkListItemsRef, 
        where('position', '==', oldPosition),
        where('ship', '==', targetShip),
        where('area', '==', targetOldArea)
      );
      const querySnapshot = await getDocs(q);
      
      console.log("querySnapshot empty:", querySnapshot.empty);
      if (!querySnapshot.empty) {
        console.log("Documents found:", querySnapshot.docs.map(doc => doc.data()));
      }

      if(querySnapshot.empty) {
        setMessage(`'${targetShip}'の'${targetOldArea}'エリアで'${oldPosition}'のPositionを持つドキュメントは見つかりませんでした。`);
        return;
      }

      querySnapshot.forEach((doc) => {
        batch.update(doc.ref, {position: editPositon.position, area: editPositon.area});
      });
      await batch.commit();
      setMessage(`'${targetShip}'の'${targetOldArea}'エリアで'${oldPosition}'のPositionを持つすべてのドキュメントが'${editPositon.position}' に更新されました！`);
    } catch(error) {
      console.error('Positionの更新中にエラーが発生しました:', error);
      setMessage('Positionの更新中にエラーが発生しました。');
    }
  }; 
  
  console.log(message);


// item更新処理
  
  const HandleUpdateItem = async (updatedData: editItemSchemaTs) => {
    setMessage("アイテム更新中...");
    if (!targetItemId) {
      setMessage("更新対象のアイテムが選択されていません。");
      return
    }
    try {
      const itemDocRef = doc(db, "checklistItem", targetItemId);

      await updateDoc(itemDocRef, {
        area: updatedData.area,
        position: updatedData.position,
        name: updatedData.item, // editItemSchemaTsの'item'はFirestoreの'name'に対応
        number: updatedData.number,
        startDate: updatedData.startDate,
        endDate: updatedData.endDate,
      });
      setMessage(`アイテム（ID: ${targetItemId}）が正常に更新されました！`);
      console.log("Item updated successfully, ID:", targetItemId);

    } catch(error) {
      console.error('アイテムの更新中にエラーが発生しました:', error);
      setMessage('アイテムの更新中にエラーが発生しました。');
      if(isFireStoreError(error)) {
        console.log("Firestore エラーコード:", error.code, "メッセージ:", error.message);
      }
    }
  }

  // item削除処理

  const HandleDeleteItem = async() => {
    setMessage("アイテム削除中");
    if (!targetItemId) {
      setMessage("削除対象のアイテムが選択されません。");
      return;
    }
    try {
      const itemDocRef = doc(db, "checklistItem", targetItemId);
      await deleteDoc(itemDocRef);
      setMessage(`アイテム（ID: ${targetItemId}）が正常に削除されました！`);
      console.log("Item deleted successfully, ID:", targetItemId);
      setTargetItemId(null);

      // 削除されたアイテムがcheckedItemsに含まれていればlocalStorageから削除する
      // setCheckedItems(prevCheckedItems => prevCheckedItems.filter(id => id !== targetItemId));
      if(!isSetting){
      setCheckedItems(prevCheckedItems => {
        const newCheckedItems = { ...prevCheckedItems }; // 既存のオブジェクトをコピー
        for (const arr in newCheckedItems) {
          if (Object.prototype.hasOwnProperty.call(newCheckedItems, arr)) {
            // ARRごとの配列に対してfilterを実行
            newCheckedItems[arr] = newCheckedItems[arr].filter(id => id !== targetItemId);
          }
        }
        return newCheckedItems;
      })};

    } catch(error) {
      console.error('アイテムの削除中にエラーが発生しました:', error);
      setMessage('アイテムの削除中にエラーが発生しました。'); 
      if (isFireStoreError(error)) {
        console.log("Firestore エラーコード:", error.code, "メッセージ:", error.message);
      }     
    }
  }

  // position削除処理

  const HandleDeletePosition = async () => {
    setMessage("Positionとそのアイテム削除中")
    if(!targetPositionToDelete || !targetAreaToDelete || !targetShipToDelete) {
      setMessage("削除対象のPositionが選択されていません。");
      return; 
    }

    const batch = writeBatch(db);
    const checkListItemRef = collection(db, 'checklistItem');

    try {
      const q = query(
        checkListItemRef,
        where('ship', '==', targetShipToDelete),
        where('area', '==', targetAreaToDelete),
        where('position', '==', targetPositionToDelete)
      );
      const querySnapshot = await getDocs(q);

      if(querySnapshot.empty) {
        setMessage (`'${targetShipToDelete}'の'${targetAreaToDelete}'エリアで'${targetPositionToDelete}'のPositionを持つドキュメントは見つかりませんでした。`);
        return;
      }
      // 取得したすべてのドキュメントをバッチに追加して削除
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      setMessage(`Position '${targetPositionToDelete}' と関連アイテムが正常に削除されました！`);
      console.log("Position and associated items deleted successfully:", targetPositionToDelete);



      // 削除後、stateをクリア
      setTargetShipToDelete(null);
      setTargetAreaToDelete(null);
      setTargetPositionToDelete(null);

    } catch(error) {
      console.error('Positionとそのアイテムの削除中にエラーが発生しました:', error);
      setMessage('Positionとそのアイテムの削除中にエラーが発生しました。');
      if (isFireStoreError(error)) {
        console.log("Firestore エラーコード:", error.code, "メッセージ:", error.message);
      }     
    }
  }


  // transferRecordをfireStoreから全て取得 *******************************************
  useEffect(() => {
    const collectionRef = collection(db, "transferRecord");
    const subscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const transferRecordData = querySnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        } as TransferRecord;
      });

      console.log("transferRecordData:", transferRecordData);
      setTransferRecordDatas(transferRecordData);   

    }, (error) => {
      if(isFireStoreError(error)) {
        console.log("Firestore リアルタイムリスナーエラー:", error.code, error.message)
      } else {
        console.error("一般的なリアルタイムリスナーエラー:", error)
      }
    });
    
    return () => subscribe();
  },[]);
  console.log("transferRecordDatas:", transferRecordDatas);

  return (
   <ThemeProvider theme={theme}>
   <CssBaseline />
   <Router>
    <Routes>
      <Route 
         path="/" 
         element={
          <AppLayout 
            isSetting={isSetting} 
            setIsSetting={setIsSetting}
            isAdd={isAdd}
            setIsAdd={setIsAdd}
            isDelete={isDelete}
            setIsDelete={setIsDelete}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            isDefaultEntry={isDefaultEntry}
            setIsDefaultEntry={setIsDefaultEntry}
            currentDateTimeFormatted={formatDateTime(currentDateTime)} 
            isPersonalRecord={isPersonalRecord}
            setIsPersonalRecord={setIsPersonalRecord}
                     
          />
        }
      >
        <Route
          path="/"
          element={
            // isSettingの状態に基づいて、HomeまたはFlightListをレンダリング
            isSetting ? (
              <Home isSetting={isSetting} />
            ) : (
              // isSettingがfalseの時、FlightListを表示
              <FlightList
                currentFlights={currentFlights}
                flightsCopy={handleCopy}
                isCopying={isCopying}
                message={message}
                // isDefaultEntryがtrueなら"defaultFlights"、falseなら"currentFlights"
                onUpdateFlight={(updatedFlight) =>
                  handleUpdateFlightInfo(
                    updatedFlight,
                    isDefaultEntry ? "defaultFlights" : "currentFlights"
                  )
                }
                onDeleteFlight={(flightId) =>
                  handleDeleteFlight(
                    flightId, 
                    isDefaultEntry ? "defaultFlights" : "currentFlights"
                    )
                }              
                defaultFlights={defaultFlights}
                isDefaultEntry={isDefaultEntry}
                completedARRs={completedARRs}
                setCompletedARRs={setCompletedARRs}
                transferRecordDatas={transferRecordDatas} 
              />
            )
          }
        />
      
        <Route 
          path="/CheckListLayout" 
          element={<CheckListLayout 
            listItems={listItems}
            isSetting={isSetting}
            isAdd={isAdd}
            isDelete={isDelete}
            isEdit={isEdit}
            onSaveAddPosition={handleSaveAddPosition}
            setSettingFormShip={setSettingFormShip}
            setSettingFormArea={setSettingFormArea}
            setSettingFormPosition={setSettingFormPosition}
            onSaveAddItem={handleSaveAddItem}
            setOldPosition={setOldPosition}
            setOldArea={setOldArea}
            oldArea={oldArea} 
            OnUpdatePosition={(editPosition) => HandleUpdatePosition(editPosition, settingFormShip, oldArea)}
            OnUpdateItem={HandleUpdateItem}
            setTargetItemId={setTargetItemId}
            OnDeleteItem={HandleDeleteItem}
            OnDeletePosition={HandleDeletePosition}
            setTargetShipToDelete={setTargetShipToDelete}
            setTargetAreaToDelete={setTargetAreaToDelete}
            setTargetPositionToDelete={setTargetPositionToDelete}
            currentDateTimeFormatted={formatDateTime(currentDateTime)}
            areaCheckStatus={areaCheckStatus}
            checkedItems={checkedItems}
            onToggleItem={handleToggleItem}
            currentARR={currentARR}
            setCurrentARR={setCurrentARR}
            completedARRs={completedARRs}
            setCompletedARRs={setCompletedARRs}
            transferRecordDatas={transferRecordDatas} 
            setTransferRecordDatas={setTransferRecordDatas}       
          />} 
        >
          <Route path=":shipName" element={null} />
        </Route>
        <Route path="/PersonalRecord" element={
          <PersonalRecord
            transferRecordDatas={transferRecordDatas} 
          />
        }/>  
      </Route>
  

      <Route path="/*" element={<NoMatch />} />
    </Routes>
   </Router>
   </ThemeProvider> 
  )
}

export default App
