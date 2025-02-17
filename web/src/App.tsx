

import './App.css'

function App() {


  return (
    <main className='w-full h-screen bg-custom-dark font-display flex items-center justify-center'>
      <div className='text-white w-max flex flex-col gap-11'>
        <div className='flex flex-col '>
          <span className='text-custom-gray'>Mente de Anne Matos</span>
          <h1 className='text-4xl font-extrabold'>Acesse sua conta, Anne</h1>
        </div>
        <div className='flex flex-col gap-3 w-full items-center'>
          <div className='flex flex-col'>
            <span className='text-custom-gray'>E-mail</span>
            <input className='p-3 w-[300px] rounded-[5px] border-[0.1px] border-custom-gray bg-custom-black outline-none focus:border-[1px] focus:border-custom-purple ' type="text" />
          </div>

          <div className='flex flex-col '>
            <span className='text-custom-gray'>Senha</span>
            <input className='p-3 w-[300px] rounded-[5px] border-[0.1px] border-custom-gray bg-custom-black outline-none focus:border-custom-purple' type="text" />
          </div>
          <button className='p-3 w-[300px] rounded-[5px] h-[50px] bg-custom-purple text-white text-center font-bold '>Entrar</button>
        </div>
      </div>
   
      
    </main>
  )
}

export default App
