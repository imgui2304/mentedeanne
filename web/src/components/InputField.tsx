interface InputFieldProps {
    name: string;
    placeholder: string;
    value: string;
    type: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  const InputField = ({ name, placeholder, value, onChange, type }: InputFieldProps) => {
    return (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
    
        onChange={onChange}
        className="p-3 rounded-[5px] bg-custom-black text-text-dark"
        required
      />
    );
  };
  
  export default InputField;
  