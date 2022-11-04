import Image from "next/image";
import mobileApplicationPhoto from "../assets/mobile_background.png";
import nlwTitle from "../assets/logo.svg";
import exampleUsers from "../assets/avatares.png";
import iconCheck from "../assets/icon.png";
import { api } from "../lib/api";
import { FormEvent, useEffect, useState } from "react";

interface HomePros {
  poolCount: number,
  guessCount: number,
  usersCount: number
}

export default function Home(props: HomePros) {
  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/pools', { 
        title: poolTitle
      })
      
      const { code } = response.data
      await navigator.clipboard.writeText(code)

      alert('Bolão criado com sucesso, o código do bolão foi copiado para área de transferencia')
      setPoolTitle('');

    } catch (error) {
      console.log(error)
      alert('Não foi possivel criar o bolão')
    }
  }
  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={nlwTitle} alt="Logo da NLW Copa"/>

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={exampleUsers} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.usersCount} </span>
            pessoas já estão usando
          </strong>
        </div>

        <form  onSubmit={createPool} className="mt-10 flex gap-2">
          <input 
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-200"
            type="text"
            value={poolTitle}
            onChange={event => setPoolTitle(event.target.value)} 
            required 
            placeholder="Qual nome do seu bolão?"
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt="" />
            <div className="flex flex-col">
              <span>+ {props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600"/>

          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt="" />
            <div className="flex flex-col">
              <span>+ {props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image 
        src={mobileApplicationPhoto} 
        alt="NLW Copa versão mobile"
        quality={100}
      />
    </div>
  )
}


export const getServerSideProps = async () => {
  //realizar requisições em paralelo
  const [poolCountResponse, guessCountResponse, usersCountResponse] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count')
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount: usersCountResponse.data.count
    }
  }
}