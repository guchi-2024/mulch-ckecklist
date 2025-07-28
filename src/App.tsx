
// import './App.css'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Home from "./pages/Home"
import NoMatch from "./pages/NoMatch"
import AppLayout from "./components/layout/AppLayout"
import { ThemeProvider } from "@emotion/react"
import { CssBaseline } from "@mui/material"
import { theme } from "./theme/theme"
import CheckListLayout from "./components/layout/CheckListLayout"
import { useCallback, useEffect, useState } from "react"
import { ListItems } from "./types/index"
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where, writeBatch } from "firebase/firestore"
import { db } from "./firebase"
import { addItemSchemaTs, addPositionSchemaTs, editItemSchemaTs, editPositionSchemaTs } from "./validations/schema"
import { string } from "zod"

export interface AreaCheckStatus {
  [shipName: string]: {
    [areaName: string]: {
      total: number;
      checked: number;
    };
  };
}

const LOCAL_STORAGE_KEY = "checkedItems"; // Local Storageのキーを定数として定義

function App() {

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const[listItems, setListItems] = useState<ListItems[]>([]);
  const[isSetting, setIsSetting] = useState(false);
  const[isAdd, setIsAdd] = useState(false); 
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
  const [checkedItems, setCheckedItems] = useState<string[]>(() => {
    try {
      const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedItems ? JSON.parse(storedItems) : [];
    } catch(error) {
      console.error("Failed to load checked items from local storage:", error);
      return [];
    }
  });
  const [areaCheckStatus, setAreaCheckStatus] = useState<AreaCheckStatus>({});


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


  // checkedItemsが変更されるたびにLocal Storageに保存
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(checkedItems));
    } catch(error) {
      console.error("Failed to save checked items to local storage:", error);
    }
  }, [checkedItems]);
  
  
  // Firestoreエラーかどうかを判定する型ガード
  function isFireStoreError(error: unknown):error is {code: string, message: string} {
    return typeof error === "object" && error !== null && "code" in error
  }

  // Firestoreからデータを取得し、チェック状態を計算する
  useEffect(() => {
    const collectionRef = collection(db, "checklistItem");

    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const listItemsData = querySnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        } as ListItems;
      });
      console.log("Realtime listItemsData:", listItemsData);
      setListItems(listItemsData);

      // エリアごとの合計数を計算（チェック数は後でローカルstateで処理)
      const newAreaCheckStatus: AreaCheckStatus = {};
      listItemsData.forEach(item => {
        if (!newAreaCheckStatus[item.ship]) {
          newAreaCheckStatus[item.ship] ={};
        }
        if (!newAreaCheckStatus[item.ship][item.area]) {
          newAreaCheckStatus[item.ship][item.area] = { total:0, checked:0};
        }
        newAreaCheckStatus[item.ship][item.area].total++;
      });
      setAreaCheckStatus(newAreaCheckStatus);

    }, (error) => {
      if(isFireStoreError(error)) {
        console.log("Firestorリアルタイムリスナーエラー: ", error.code, error.message)
      } else {
        console.error("一般的なリアルタイムリスナーエラー:", error)
      }
    });
    return () => unsubscribe();
  }, []);

  // checkedItems または listItems が変更されたときに areaCheckStatus の checked 数を更新
  useEffect(() => {
    const updatedAreaCheckStatus = { ...areaCheckStatus };

    // すべてのチェック数をリセット
    for (const shipName in updatedAreaCheckStatus) {
      for(const areaName in updatedAreaCheckStatus[shipName]) {
        updatedAreaCheckStatus[shipName][areaName].checked = 0;
      }
    }
    
    // checkedItemsに基づいてチェック数を再計算
    checkedItems.forEach(checkedItemId => {
      const item = listItems.find(li => li.id === checkedItemId);
      if(item && updatedAreaCheckStatus[item.ship] && updatedAreaCheckStatus[item.ship][item.area]) {
        updatedAreaCheckStatus[item.ship][item.area].checked++;
      }
    });
    setAreaCheckStatus(updatedAreaCheckStatus);
  }, [checkedItems, listItems]);

  console.log("Current listItems state:", listItems);
  console.log("Current checkedItems state:", checkedItems);
  console.log("Current areaCheckStatus state:", areaCheckStatus);

  // アイテムのチェック状態をローカルで更新する関数
  const handleToggleItem = useCallback((itemId: string) => {
    setCheckedItems((prevCheckedItems) => {
      const currentIndex = prevCheckedItems.indexOf(itemId);
      if (currentIndex === -1) {
        return[...prevCheckedItems, itemId];
      } else {
        const newChecked = [...prevCheckedItems];
        newChecked.splice(currentIndex, 1);
        return newChecked;
      }
    })
  }, []);




 
  // firestoreからアイテムデータを全て取り出してlistItemsに収納
  useEffect(() => {

    const collectionRef = collection(db, "checklistItem");
    
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const listItemsData = querySnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        } as ListItems;
      });

      console.log("Realtime listItemsData:", listItemsData);
      setListItems(listItemsData);   

    }, (error) => {
      if(isFireStoreError(error)) {
        console.log("Firestore リアルタイムリスナーエラー:", error.code, error.message)
      } else {
        console.error("一般的なリアルタイムリスナーエラー:", error)
      }
    });
    
    return () => unsubscribe();
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
      setCheckedItems(prevCheckedItems => prevCheckedItems.filter(id => id !== targetItemId));

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
            currentDateTimeFormatted={formatDateTime(currentDateTime)}   
          />
        }
      >
        <Route 
          path="/" 
          element={<Home isSetting={isSetting} />} 
        />
        <Route path="/CheckListLayout" 
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
                        />} 
        >
          <Route path=":shipName" element={null} />
        </Route>  
      </Route>

      <Route path="/*" element={<NoMatch />} />
    </Routes>
   </Router>
   </ThemeProvider> 
  )
}

export default App
