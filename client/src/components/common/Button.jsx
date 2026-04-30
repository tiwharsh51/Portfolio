import React from 'react';

const Button = ({ children, className = '', type = 'button', onClick, disabled = false, as = 'button', ...rest }) => {
  const Component = as;
  return (
    <Component
      type={as === 'button' ? type : undefined}
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default React.memo(Button);
