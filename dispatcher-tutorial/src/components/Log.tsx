import * as React from "react";
import { useRecoilValue } from "recoil";
import { logEntryListState } from "../atoms";

export const Log = () => {
    const logEntries = useRecoilValue(logEntryListState);
    
    return (
        <>
          {logEntries.map((entry, index) => (
              <div key={index}>
              <span>{entry}</span>              
            </div>            
          ))}
        </>
      );
};
