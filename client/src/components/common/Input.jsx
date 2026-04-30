import React from 'react';

const Input = ({ label, id, as = 'input', className = '', ...rest }) => {
  const Component = as;
  return (
    <div className="space-y-3">
      {label && <label htmlFor={id} className="text-[10px] font-bold text-dim uppercase tracking-widest ml-1">{label}</label>}
      <Component id={id} className={className} {...rest} />
    </div>
  );
};

export default React.memo(Input);
