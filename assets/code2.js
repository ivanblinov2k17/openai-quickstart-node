import React, { useState, useRef } from 'react';
import TreeList, {
  Column,
  Editing,
  KeyboardNavigation,
} from 'devextreme-react/tree-list';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import { employees } from './data.js';

const expandedRowKeys = [1, 2, 4, 5];

function App() {
  const [editOnKeyPress, setEditOnKeyPress] = useState(true);
  const [enterKeyAction, setEnterKeyAction] = useState('moveFocus');
  const [enterKeyDirection, setEnterKeyDirection] = useState('column');
  const treeListRef = useRef(null);

  const onFocusedCellChanging = (e) => {
    e.isHighlighted = true;
  };

  const editOnKeyPressChanged = (e) => {
    setEditOnKeyPress(e.value);
  };

  const enterKeyActionChanged = (e) => {
    setEnterKeyAction(e.value);
  };

  const enterKeyDirectionChanged = (e) => {
    setEnterKeyDirection(e.value);
  };

  return (
    <div id="tree-list-demo">
      <TreeList
        id="employees"
        ref={treeListRef}
        dataSource={employees}
        keyExpr="ID"
        parentIdExpr="Head_ID"
        columnAutoWidth={true}
        defaultExpandedRowKeys={expandedRowKeys}
        onFocusedCellChanging={onFocusedCellChanging}>
        <KeyboardNavigation
          editOnKeyPress={editOnKeyPress}
          enterKeyAction={enterKeyAction}
          enterKeyDirection={enterKeyDirection} />
        <Editing
          mode="batch"
          allowUpdating={true}
          startEditAction="dblClick" />
        <Column
          dataField="Full_Name">
        </Column>
        <Column
          dataField="Prefix"
          caption="Title">
        </Column>
        <Column
          dataField="Title"
          caption="Position">
        </Column>
        <Column
          dataField="City">
        </Column>
        <Column
          dataField="Hire_Date"
          dataType="date">
        </Column>
      </TreeList>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option-container">
          <div className="option check-box">
            <CheckBox text="Edit On Key Press"
              value={editOnKeyPress}
              onValueChanged={editOnKeyPressChanged} />
          </div>
          <div className="option">
            <span className="option-caption">Enter Key Action</span>
            <SelectBox className="select"
              items={['startEdit', 'moveFocus', 'none']}
              value={enterKeyAction}
              onValueChanged={enterKeyActionChanged} />
          </div>
          <div className="option">
            <span className="option-caption">Enter Key Direction</span>
            <SelectBox className="select"
              items={['none', 'column', 'row']}
              value={enterKeyDirection}
              onValueChanged={enterKeyDirectionChanged} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;