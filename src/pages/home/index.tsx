import { Link } from "react-router-dom"
import styles from "./home.module.css"
import { BiSearch } from "react-icons/bi"
import { useState, type FormEvent, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export interface CoisProps {
    id: string
    rank: string
    symbol: string
    name: string
    supply: string
    maxSupply: string
    marketCapUsd: string
    volumeUsd24Hr: string
    priceUsd: string
    changePercent24Hr: string
    vwap24Hr: string
    explorer: string
    formatedPrice?: string
    formatedMarket?: string
    formatedVolumeUsd?: string
}

interface DataProps {
    data: CoisProps[]
}

export function Home() {
    const navigate = useNavigate()
    const [input, setInput] = useState("");
    const [coins, setCoins] = useState<CoisProps[]>([])
    const [offset, setOfsset] = useState(0)


    useEffect(() => {

        getData()

    }, [offset])

    async function getData() {
        fetch(`https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&apiKey=278241676c5b9f2e836e608c3f1aac29ab497015fed799b4214fee4e397c6284`)
            .then(response => response.json())
            .then((data: DataProps) => {
                const coinsData = data.data

                const price = Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD"
                })
                const priceCompact = Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    notation: "compact"
                })

                const resultFormated = coinsData.map((item) => {

                    const formated = {
                        ...item,
                        formatedPrice: price.format(Number(item.priceUsd)),
                        formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
                        formatedVolumeUsd: priceCompact.format(Number(item.volumeUsd24Hr))
                    }
                    return formated
                })

                const listCoins = [...coins, ...resultFormated]
                setCoins(listCoins)

            })
    }

    function register(e: FormEvent) {
        e.preventDefault();

        if (input === "") return;

        navigate(`/detail/${input}`)
    }

    function GetMore() {
        if (offset === 0) {
            setOfsset(10)
            return
        }

        setOfsset(offset + 10)
    }

    return (
        <main className={styles.container}>
            <form className={styles.form} onSubmit={register}>
                <input type="text"
                    placeholder="Qual o nome da moeda? Ex: Bitcoin"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <button type="submit">
                    <BiSearch size={30} color="#fff" />
                </button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th scope="col">Nome da moeda</th>
                        <th scope="col">valor de mercado</th>
                        <th scope="col">preço da moeda</th>
                        <th scope="col">quantidade</th>
                        <th scope="col">Mudança 24h</th>
                    </tr>
                </thead>


                <tbody>
                    {coins.length > 0 && coins.map((item) => (
                        <tr className={styles.tr} key={item.id}>
                            <td className={styles.tdLabel} data-label="Nome da moeda">
                                <div className={styles.name}>
                                    <img
                                        className={styles.img}
                                        alt="logo"
                                        src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`} />
                                    <Link to={`/detail/${item.id}`}>
                                        <span>{item.name}</span> | {item.symbol}
                                    </Link>
                                </div>
                            </td>
                            <td className={styles.tdLabel} data-label="valor de mercado">{item.formatedMarket}</td>
                            <td className={styles.tdLabel} data-label="preço da moeda">{item.formatedPrice}</td>
                            <td className={styles.tdLabel} data-label="quantidade">{item.formatedVolumeUsd}</td>
                            <td data-label="mudança 24h" className={Number(item.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss}>
                                <span>{Number(item.changePercent24Hr).toFixed(3)}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>


            </table>

            <button className={styles.button} onClick={GetMore}>
                Carregar mais
            </button>
        </main>
    )
} 