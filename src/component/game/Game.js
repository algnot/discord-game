import React , {useEffect , useState } from 'react'
import style from './game.module.css'
import demon1 from './../../img/1.png'
import demon2 from './../../img/2.png'
import demon3 from './../../img/3.png'
import demon4 from './../../img/4.png'
import fire from './../../img/fire.png'
import magic from './../../img/magic.png'
import shop from './../../img/shop.png'
import { firestore } from '../../firebase/firebase'
import queryString from 'query-string'
import Shop from '../shop/Shop'

const monsterInfo = [ 
    {name:'solomon'  , life:100 , reward:20 , pic : demon1},
    {name:'domino'   , life:120 , reward:25 , pic : demon2}, 
    {name:'watapong' , life:60  , reward:15 , pic : demon3}, 
    {name:'mamalo'   , life:200 , reward:30 , pic : demon4} 
]

export default function Game() {

    const user = queryString.parse(window.location.search).user
    const [isAuto, setIsAuto] = useState(false)

    const [showShop, setShowShop] = useState(false)
    const [showKeyboard, setShowKeyboard] = useState(true)

    const [monster, setMonster] = useState({
        name:'null'   , life:999999 , reward:0 , pic : ''
    })

    const [hit , setHit] = useState(false)
    const [magicA , setMagic] = useState(false)
    const [HP , setHP] = useState(999999)
    const [userInfo, setUser] = useState({
        username : 'null',
        point : 'null',
        coin : 'null',
        id : 'null',
        ATK : 0,
        autoATK : 0,
        autoDelay : 1000
    })

    useEffect(() => {
        const rand = Math.floor(Math.random() * 4);
        setMonster(monsterInfo[rand])
        setHP(monsterInfo[rand].life)
        firestore.collection('users').doc(user)
        .onSnapshot(data => {
            if(data.exists){
                setUser({
                    username : data.data().username,
                    point : data.data().point,
                    coin : data.data().coin ? data.data().coin : 0,
                    id : data.data().id,
                    ATK : !isNaN(data.data().ATK) ? data.data().ATK : 3,
                    autoATK : data.data().autoATK ? data.data().autoATK : 0,
                    autoDelay : data.data().autoDelay ? data.data().autoDelay : 2000,
                })
            }     
        })
        
    }, [])

    function onHit () {
        if(HP <= 0){
            setHit(false)
            setHP('loading..')
            setMonster({
                name:'loading..'  , life:'loading..' , reward:0 , pic : ''
            })
            firestore.collection('users').doc(user)
            .get().then(data => {
                firestore.collection('users').doc(user)
                .update({ 
                    point : data.data().point ? data.data().point + monster.reward : monster.reward,
                    coin : data.data().coin ? data.data().coin + monster.reward : monster.reward,
                })
                .then(() => {
                    const rand = Math.floor(Math.random() * 4);
                    setMonster(monsterInfo[rand])
                    setHP(monsterInfo[rand].life)
                    setHit(false)
                })
                firestore.collection('history')
                .add({
                    username : userInfo.username,
                    reward : monster.reward,
                    usernameId : userInfo.id,
                    stemp : new Date().valueOf(),
                    monster : monster
                })
            })
            return
        } else {
            setHit(true)
            setHP((HP) => Math.round(HP - userInfo.ATK, 2))
            setTimeout(() => {
                setHit(false)
            },300)
        }
    }

    const autoAttack = () => {
        setIsAuto(true)
        if(userInfo.autoATK < 1) return
        const interval = setInterval(() => {
            setMagic(true)
            setHP((HP) => Math.round(HP - userInfo.autoATK, 2))
        }, userInfo.autoDelay);
        return () => clearInterval(interval);
    }

    const setkeyBoard = () => {
        setShowKeyboard(false)
        document.addEventListener('keydown', onHit);
    }

    return (
        <>
        <div className={style.shop}
             onClick={() => setShowShop(true)}>
            <img src={shop} alt="shop" /> shop
        </div>
        {
            showKeyboard && 
            <div className={style.key}
             onClick={() => setkeyBoard()}>
                <img src={fire} alt="fire" /> Use keyboard
            </div>
        }
        {
            !isAuto  &&
            <div className={style.auto} onClick={autoAttack}>
                <img src={magic} alt="magic" /> auto 
            </div>
        }
        {
            showShop &&
            <Shop setShowShop={setShowShop}/>
        }
        <div className={style.container}>
            <div className={style.monterInfo}>
                <div className={style.monterName}>{monster.name} (HP:{HP < 0 ? 1 : HP})</div>
                <div className={style.monterHP}
                     style={{width: `${HP < 0 ? 1 : (HP/monster.life)*40}vw` , opacity : HP/monster.life}}></div>
            </div>
            <div className={style.monsterImg}
                 onClick={onHit}
                 style={{backgroundImage: `url(${monster.pic})` }}>
                {
                    hit && HP > 0 && <img src={fire} alt="fire" /> 
                }
                {
                    magicA && HP > 0 && <img src={magic} alt="magic" /> 
                }
                {
                    HP <= userInfo.ATK && 
                    <div className={style.finish}>
                        Click to finish <br/>
                        Can't use keyboard/auto
                    </div>
                }  
            </div>
        </div>
        </>
    )
}
