import React from 'react';

interface ParamProps {
  value: string;
  setValue(value: string): void;
  labelText: string;
  fieldText: string;
  type?: 'text' | 'password';
}

const InputElement: React.FC<ParamProps> = ({ value, setValue, labelText, fieldText, type }) => {
  return (<div className="form-group landing">
    <label>{labelText}</label>
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
      className="form-control p-3 h-25"
      placeholder={fieldText}
      type={type ? type : 'text'}
    />
  </div>
)}

export { InputElement };
