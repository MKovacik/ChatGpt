import React, { useRef, useEffect } from 'react';

const AutoResizingTextarea = ({ value, onChange }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    adjustTextareaHeight();
  });

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  return (
    <textarea
      ref={textareaRef}
      onChange={onChange}
      value={value}
      className="form-control"
    />
  );
};

export default AutoResizingTextarea;
