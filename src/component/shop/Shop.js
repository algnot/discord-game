import React , {useState , useEffect} from 'react'
import style from './shop.module.css'
import fire from './../../img/fire.png'
import magic from './../../img/magic.png'
import coin from "./../../img/coin.png"
import queryString from 'query-string'
import { firestore } from '../../firebase/firebase'

export default function Shop({setShowShop}) {

    const user = queryString.parse(window.location.search).user; 
    const [coins, setCoin] = useState(0)
    const [dataD , setData] = useState({
        ATK : 3,
        autoATK : 0,
        autoDelay : 2000,
    })
    const [atk, setAtk] = useState(0)
    const [autoAtk, setAutoAtk] = useState(0)
    const [autoDelay, setAutoDelay] = useState(0)
    const [error, setError] = useState('')

    useEffect(() => {
        firestore.collection('users').doc(user)
        .onSnapshot(data => {
            if(data.exists){
                setAtk(0)
                setAutoDelay(0)
                setAutoAtk(0)
                setCoin(data.data().coin)
                setData({
                    ATK : data.data().ATK ? data.data().ATK : 3,
                    autoATK : data.data().autoATK ? data.data().autoATK : 0,
                    autoDelay : data.data().autoDelay ? data.data().autoDelay : 2000,
                })
            }
        })
    }, [])

    const inCreteAtk = () => {
        setAtk((atk) => atk = atk + 1)
        setCoin((coin) => coin = coin - 1500)
    }

    const deCreteAtk = () => {
        if(atk <= 0) return
        setAtk((atk) => atk = atk - 1)
        setCoin((coin) => coin = coin + 1500)
    }

    const inCreteAutoAtk = () => {
        setAutoAtk((autoAtk) => autoAtk = autoAtk + 1)
        setCoin((coin) => coin = coin - 3000)
    }

    const deCreteAutoAtk = () => {
        if(autoAtk <= 0) return
        setAutoAtk((autoAtk) => autoAtk = autoAtk - 1)
        setCoin((coin) => coin = coin + 3000)
    }

    const inCreteAutoDelay = () => {
        setAutoDelay((autoDelay) => autoDelay = autoDelay + 10)
        setCoin((coin) => coin = coin - 1200)
    }

    const deCreteAutoDelay= () => {
        if(autoDelay <= 0) return
        setAutoDelay((autoDelay) => autoDelay = autoDelay - 10)
        setCoin((coin) => coin = coin + 1200)
    }

    const Confirm = () => {
        setError('')
        if(coins < 0) {
            setError('you don\'t have enough coins!')
            return
        }
        if(dataD.autoDelay - autoDelay < 500) {
            setError('Delay must be greater than or equal to 500!')
            return
        }
        firestore.collection('users').doc(user)
        .update({
            ATK : dataD.ATK + atk,
            autoATK : dataD.autoATK + autoAtk,
            autoDelay : dataD.autoDelay - autoDelay,
            coin : coins
        })
        .then(() => {
            setError('successful purchase!')
            setAtk(0)
            setAutoAtk(0)
            setAutoDelay(0)
        })
    }

    return (
        <div className={style.container}>
            <div className={style.shopContainer}>
                <div className={style.header}>
                    <div className={style.textHeader}>Shop</div> 
                    <div className={style.textHeader2}
                         onClick={() => setShowShop(false)}>X</div> 
                </div>
                you have {coins} <img src={coin} alt="coin" /> 
                <div className={style.content}>
                    <div className={style.item}>
                        <div style={{display:'flex' , alignItems: 'flex-start'}}>
                            <img src={fire} alt="fire" /> + 1  (<img src={coin} alt="coin" /> x 1500)
                        </div>
                        <div>
                            <span className={style.btn}onClick={deCreteAtk}>-</span> {atk} <span className={style.btn}onClick={inCreteAtk}>+</span>
                        </div>
                    </div>
                    <div className={style.item}>
                        <div style={{display:'flex' , alignItems: 'flex-start'}}>
                            <img src={magic} alt="magic" /> + 1  (<img src={coin} alt="coin" /> x 3000)
                        </div>
                        <div>
                            <span className={style.btn}onClick={deCreteAutoAtk}>-</span> {autoAtk} <span className={style.btn}onClick={inCreteAutoAtk}>+</span>
                        </div>
                    </div>
                    <div className={style.item}>
                        <div style={{display:'flex' , alignItems: 'flex-start'}}>
                        <img src={magic} alt="magic" /> - 10ms  (<img src={coin} alt="coin" /> x 1200)
                        </div>
                        <div>
                            <span className={style.btn}onClick={deCreteAutoDelay}>-</span> {autoDelay} <span className={style.btn}onClick={inCreteAutoDelay}>+</span>
                        </div>
                    </div>
                    <div className={style.btn} 
                         onClick={Confirm}
                         style={{padding:'10px'}}>
                        Confirm
                    </div>
                    <div className={style.btn} 
                         onClick={() => setShowShop(false)}
                         style={{padding:'10px', marginTop:20}}>
                        Back 
                    </div>
                    <br/>
                    {error}
                </div>
            </div>
            
        </div>
    )
}
