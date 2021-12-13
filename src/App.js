import './App.css';
import style from './index.module.css'
import background from "./img/bg.png"
import coin from "./img/coin.png"
import React , { useState , useEffect } from 'react'
import fire from './img/fire.png'
import magic from './img/magic.png'
import queryString from 'query-string'
import Game from './component/game/Game'
import {firestore} from './firebase/firebase'

function App() {

  const [menu, setMenu] = useState('Home')
  const [user, setUser] = useState({
    username : 'null',
    point : 'null',
    coin : 'null',
    id : 'null',
    ATK : 0,
    autoATK : 0,
    autoDelay : 2000
  })

  useEffect(() => {
    const parsed = queryString.parse(window.location.search); 
    if(!parsed.user) {
      setMenu('Error')
    } else {
      const userRef = firestore.collection('users').doc(parsed.user)
      userRef.onSnapshot(data => {
        if(data.exists){
          setUser({
            username : data.data().username,
            point : data.data().point,
            coin : data.data().coin ? data.data().coin : 0,
            id : data.data().id,
            ATK : data.data().ATK ? data.data().ATK : 3,
            autoATK : data.data().autoATK ? data.data().autoATK : 0,
            autoDelay : data.data().autoDelay ? data.data().autoDelay : 2000,
          })
        } else {
          setMenu('Error')
        }
      })
    }
  },[])

  return (
    <div className={style.container}
         style={{backgroundImage: `url(${background})` }}>
      <div className={style.infoContainer}>
         <div className={style.coin}>
            <img src={coin} alt="coin" /> 
            {user.username} <br/> x {user.coin} 
         </div>
         <div className={style.point}>
          point<br/> {user.point} 
         </div>
         <div className={style.status}>
          Status <br/> <br/> 
          <img src={fire} alt="fire" /> x {user.ATK} &nbsp; 
          <img src={magic} alt="magic" /> x {user.autoATK} <br/> <br/>  
          (<img src={magic} alt="magic" /> {user.autoDelay} ms)
         </div>
      </div>
      {
        menu == 'Home' &&
        <div>
          <div className={style.textHead}>TARO ADVENTURE</div>
          <div className={style.textTitle}>V1.0</div>
          <div className={style.textMenu}
               onClick={() => setMenu('Game')}>Play</div>
          <div className={style.textMenu}>How to play</div>
        </div>
      }

      {
        menu == 'Game' &&
        <Game />
      }

      {
        menu == 'Error' &&
        <div>
          <div className={style.textHead}>TARO ADVENTURE</div>
          <div className={style.textTitle}>V1.0</div>
          <div className={style.textError}>Can not found your id</div>
          <div className={style.textError}>id : {user.id}</div>
        </div>
      }
      
    </div>
  );
}

export default App;
