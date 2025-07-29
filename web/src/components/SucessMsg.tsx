interface SucessProps {
    sucess: number;
}

const Sucess: React.FC<SucessProps> = ({sucess}) => {

    const RenderMessage = (value: number) => {
        if(value === 1) {
            return (
            <div className="mt-4 p-3 bg-green-600 fixed bottom-5 text-white rounded">
              Documento criado com sucesso!
            </div>
            );
        } else if (value === 2) {
            return (
            <div className="mt-4 p-3 bg-red-500 fixed bottom-5  text-white rounded">
              Falha. Documento não criado!
            </div>
            );
        }   else {
            return null;
        }
    }

  return (
    <>
    {      RenderMessage(sucess)}
    </>
  );
};

export default Sucess;
