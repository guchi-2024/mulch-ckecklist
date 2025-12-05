import { Box, Button, List } from '@mui/material'
import { CompanyShips, Flight, FlightShip, ShipNumbers, TransferRecord } from '../types';
import { Fragment, useEffect, useState } from 'react';
import FlightListSelect from '../components/common/flightListSelect';
import FlightListForm from '../components/common/flightListForm';
import DefaultEntryForm from '../components/common/defaultEntryForm';
import DefaultEntrySelect from '../components/common/defaultEntrySelect';

interface FlightList {
  flight: Flight;
}
// Flightインターフェースにidを追加


interface FlightListprops {
  currentFlights: FlightShip[];
  defaultFlights: FlightShip[];
  flightsCopy: () => void;
  isCopying: boolean;
  message: string;
  onUpdateFlight: (updatedFlight: Flight) => Promise<void>;
  onDeleteFlight: (flightId: string) => Promise<void>;
  isDefaultEntry: boolean;
  completedARRs: string[];
  setCompletedARRs: React.Dispatch<React.SetStateAction<string[]>>;
  transferRecordDatas: TransferRecord[]; 
}


const FlightList = ({
  flightsCopy,
  isCopying,
  currentFlights,
  message,
  onUpdateFlight,
  onDeleteFlight,
  defaultFlights,
  isDefaultEntry,
  completedARRs,
  setCompletedARRs,
  transferRecordDatas,
}: FlightListprops) => {

  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [flightsData, setFlightsData] = useState<FlightShip[]>(currentFlights);

  console.log("currentFlights:", currentFlights);
  console.log("flightsData:", flightsData);
  console.log("isDefaultEntry:", isDefaultEntry);


  useEffect(() => {
    if(isDefaultEntry) {
      setFlightsData(defaultFlights);
    } else {
    setFlightsData(currentFlights);
    }
  }, [currentFlights, defaultFlights, isDefaultEntry])


  const companyShips: CompanyShips= {
    JAL:["A350","B787"],
    JAIR:["E170","E190"],
    JAC:["ATR"]
  }

  const shipNumbers: ShipNumbers = {
    A350:["01XJ","02XJ","03XJ"],
    B787:["845J","846J","847J"],
    E170:["221J","222J","223J"],
    E190:["245J","246J","247J"],
    ATR:["01JC","02JC","03JC"],
  }



  const menuListBase = [
    {
      shipName: "A350",
      path: "/CheckListLayout/A350",
      areaBtn: ["FWD", "MID", "AFT"],
    },
    {
      shipName: "E170",
      path: "/CheckListLayout/E170",
      areaBtn: ["FWD", "AFT"],
    },
    {
      shipName: "ATR",
      path: "/CheckListLayout/ATR",
      areaBtn: ["ALL"],
    },
  ];

    // 編集アイコンがクリックされたときに呼び出される関数
    const handleEditClick = (flight: Flight) => {
      setEditingFlight(flight);
    };
  
    // フォームが閉じられたときに呼び出される関数
    const handleFormCancel = () => {
      setEditingFlight(null);
    };

    // 新しいフライトを追加する関数
    const handleAddNewFlight = (company: string) => {
      const newFlight = {
        ARR: "", 
        DEP: "", 
        ship: companyShips[company][0], 
        shipNo: "",
        memo: "",
      };

      // flightsDataを更新
      const newFlightsData = flightsData.map(companyData => {
        // クリックされた会社のデータを探す
        if (companyData.company === company) {
          // 既存のフライトリストの先頭に新しいフライトを追加
          return {
            ...companyData,
            flights: [newFlight, ...companyData.flights]
          };
        }
        return companyData;
      });
      setFlightsData(newFlightsData);
      setEditingFlight(newFlight);
      console.log("更新されたflightsData:", newFlightsData);
      console.log("更新されたeditingFlight:", newFlight);
    }; 
    
    

    // フォームの送信時に呼び出される関数
    const handleFormSubmit = (updatedFlight: Flight) => {
      console.log("更新されたFlight:", updatedFlight);
      console.log("Form Submitted - Updated Flight:", updatedFlight);
      console.log("updatedFlight.id", updatedFlight.id);
      
      // `editingFlight`に格納されているIDを`updatedFlight`にコピー
      const flightWithId: Flight = {
        ...updatedFlight,
        id: editingFlight?.id,
      };
      console.log("flightWithId:", flightWithId);
  


      try {
        // updatedFlight に Firestore のドキュメントIDが含まれているか確認
        // Firestoreのドキュメントを更新
        onUpdateFlight(flightWithId);
        console.log("Firestore update initiated for flight ID:", flightWithId.id);  
      
      // flightsDataを更新
      const newFlightsData = flightsData.map(companyData => {
        if (companyData.company === updatedFlight.company ) {
          return {
            ...companyData,
            flights: companyData.flights.map(flight => {
              // 編集中のフライトと同じARRかどうかで判断
              if (flight.ARR === updatedFlight.ARR || flight.ARR === editingFlight?.ARR) {
                return {
                  ...flight,
                  No: updatedFlight.No,
                  ARR: updatedFlight.ARR,
                  DEP: updatedFlight.DEP,
                  ship: updatedFlight.ship,
                  shipNo: updatedFlight.shipNo,
                  memo: updatedFlight.memo,
                };
              } 
              return flight;
            })
          };
        }
        return companyData;
      });
      setFlightsData(newFlightsData);
      console.log("更新されたflightsData:", newFlightsData)
      setEditingFlight(null);
    } catch (error) {
      console.error("Error submitting flight form:", error);
    }

    };

    // flightを削除
    const clickDeleteFlight = async (flightId: string | undefined) => {
      if(!flightId) {
        console.error("Cannot delete flight: Missing flight ID.");
        return
      }
      try {
        await onDeleteFlight(flightId);
        console.log("Firestore delete initiated for flight ID:", flightId);
      } catch (error) {
        console.error("Error deleting flight:", error);
      }
    };
    



  return (
  <div>

    <div>
      <button onClick={flightsCopy} disabled={isCopying}>
        {isCopying ? 'コピー中...' : 'defaultFlightsをコピー'}</button>
        {message && <p>{message}</p>}
    </div>

    {flightsData.map((companyData, companyIndex) => (
      <Fragment key={companyIndex}>
      {/* 会社名 */}
      <Box
        sx={{
          width: 300,
          borderBottom: '3px solid #f5f5f5',
          m: 3,
          fontSize: 40,
          fontWeight: "fontWeightBold",
        }}
      >
       {companyData.company === "JAIR" ? "J-AIR" : companyData.company}
      </Box>
      <Button
        onClick={() => handleAddNewFlight(companyData.company)}
        sx={{
          width: 230,
          height: 40,
          border: '2px solid #42a5f5',
          color: '#42a5f5',
          borderRadius: '7px',
          bgcolor: '#e3f2fd',
          fontSize: 15,
          ml: 3, mb: 2,
        }}
      >
        チェックリストを追加する
      </Button>
      
      <List>
        
        {isDefaultEntry ? (
          // 項目全体のコンテナ(defaultFlightList)
          companyData.flights.map((flight, flightIndex) => (
            editingFlight && editingFlight.ARR === flight.ARR ? 
            (
              <DefaultEntryForm
                key={flightIndex}
                flight={editingFlight}
                company={companyData.company} 
                companyShips={companyShips} 
                shipNumbers={shipNumbers} 
                onCancel={handleFormCancel} 
                onSave={handleFormSubmit}
                     
              />
            ) : (
              <DefaultEntrySelect
                key={flightIndex}
                flight={flight}
                onEditClick={() => handleEditClick(flight)}
                onDeleteFlight={clickDeleteFlight}
              />
            )   
          ))     
        ) : (
          // 項目全体のコンテナ(flightList)
          companyData.flights.map((flight, flightIndex) => (
            editingFlight && editingFlight.ARR === flight.ARR ? 
            (
              <FlightListForm
                key={flightIndex}
                flight={editingFlight}
                company={companyData.company} 
                companyShips={companyShips} 
                shipNumbers={shipNumbers} 
                onCancel={handleFormCancel} 
                onSave={handleFormSubmit}
                     
              />
            ) : (
              <FlightListSelect
                key={flightIndex}
                flight={flight}
                menuListBase={menuListBase}
                onEditClick={() => handleEditClick(flight)}
                currentFlights={currentFlights}
                defaultFlights={defaultFlights}
                onDeleteFlight={clickDeleteFlight}
                completedARRs={completedARRs}
                setCompletedARRs={setCompletedARRs}
                transferRecordDatas={transferRecordDatas}
              />
            )          
          ))
        )}
      </List>
    </Fragment>
    ))}
  </div>



  )
}

export default FlightList
