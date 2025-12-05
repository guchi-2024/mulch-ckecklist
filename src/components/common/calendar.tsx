import React, { useEffect, useMemo } from 'react';
import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // 2. 「触覚センサー」をインポート
// インストールが必要（npm install @fullcalendar/interaction）
import jaLocale from '@fullcalendar/core/locales/ja';
import "../../calendar.css";
import { Calendar, EventContentArg } from '@fullcalendar/core/index.js';
import PastRecordData from './pastRecordData';
import { RecordDays, TransferRecord } from '../../types';
import { record } from 'zod';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

interface CalendarProps {
  transferRecordDatas: TransferRecord[];
}

// 優先度の高いステータスを定義（数字が小さいほど優先度が高い）
const STATUS_PRIORITY = {
  '未完了': 1,
  '申し送りあり': 2,
  '全機完了': 3,
  '': 4,
}



const RecordCalendar = ({
  transferRecordDatas,
}: CalendarProps) => {

  const [selectedDate, setSelectedDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const[recordDays, setRecordDays] = useState<RecordDays[]>([]);

  // fullCalendarの基本形式
  // title,startは@fullCalendarで用意されたものなので、プロパティ変更不可
  // {start: '2025-11-02', complete: '全機完了', fltCnl: '欠航'}

  useEffect(() => {
    const fetchAllRecordDays = async () => {
      try {
        const recordDaysRef = collection(db, 'recordDays');
        const querySnapshot = await getDocs(recordDaysRef);
        const dataList: RecordDays[] = querySnapshot.docs.map((doc) => {
          return doc.data() as RecordDays;      
        });
        setRecordDays(dataList);
      } catch (error) {
        console.error("fetchAllRecordDaysにエラーが発生しました:", error);      
      }
    };
    fetchAllRecordDays();
  },[])

  const events = useMemo(() => {
    // 1. 日付ごとにデータをグループ化
    const recordsByDay = recordDays.reduce((acc, record) => {
      if(record.memo !== '欠航') {
        if(!acc[record.day]) {
          acc[record.day] = [];
        }
        acc[record.day].push(record.memo);
      }
      return acc;
    }, {} as Record<string, string[]>
    )

    // 2. グループごとにステータスを判定
    const eventList = Object.keys(recordsByDay).map((day) => {
      const memos = recordsByDay[day];
      let finalStatus: string = '全機完了';
      // 優先度ルールに基づきステータスを決定
      for (const memo of memos) {
        if(memo === '未完了') {
          finalStatus = '未完了';
          break;
        }
        if(memo === '申し送りあり' && finalStatus !== '未完了') {
          finalStatus = '申し送りあり';
        }
      }
  
      // 3. 欠航の判定
      const hasFltCnl = recordDays.some(
        (record) => record.day === day && record.memo === '欠航'
      );

      return {
        start: day,
        complete: finalStatus,
        fltCnl: hasFltCnl ? '欠航' : undefined,
      }
    });
    return eventList;
  }, [recordDays]);


  // EventContentArgの型は、return内にあるeventContentをコマンドボタンを押しながらクリック
  // するとフルカレンダー一覧が表示される
  const renderEventContent = (eventInfo: EventContentArg) => {
    const completeStatus = eventInfo.event.extendedProps.complete;
    let completeColor = 'inherit'; //黒色
    let completeFontWeight = 'normal'
    switch(completeStatus) {
      case '全機完了':
        completeColor = '#4caf50';
        completeFontWeight = 'normal' 
        break;
      case '申し送りあり':
        completeColor = '#2196f3';
        completeFontWeight = 'bold' 
        break;
      case '未完了':
        completeColor = '#9c27b0';
        completeFontWeight = 'bold'  
        break;
      default:
        completeColor = 'inherit';
        completeFontWeight = 'normal' 
        break;
    }

    // console.log('eventInfo:', eventInfo)
    return (
      <div>
        <div 
          className='achievement' 
          id='event-complete'
          style={{color: completeColor, fontWeight: completeFontWeight}}
        >
          {eventInfo.event.extendedProps.complete}
        </div>
        <div className='achievement' id='event-fltCnl'>
          {eventInfo.event.extendedProps.fltCnl}
        </div>
      </div>

    )
  };

  // 日付がクリックされたときの動き（合図を受け取ったときの処理）
  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
    setIsOpen(true);
  };

  return (
    <div>
      <FullCalendar 
       plugins={[dayGridPlugin, interactionPlugin]}
       initialView='dayGridMonth'
       locale={jaLocale}
       events={events}
       eventContent={renderEventContent}
       dateClick={handleDateClick}
       
      />
      {isOpen && (
        <PastRecordData
          date={selectedDate} 
          onColse={() => setIsOpen(false)}
          transferRecordDatas={transferRecordDatas}
          recordDays={recordDays} 
          setRecordDays={setRecordDays}
        />
      )}
    </div>
  )


}

export default RecordCalendar;

