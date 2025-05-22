import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import type { CoisProps } from "../home";
import styles from "./detail.module.css"

interface ResponseData {
    data: CoisProps
}

interface ErrorProp {
    error: string
}


type DataProps = ResponseData | ErrorProp

export function Detail() {
    const { id } = useParams()
    const navigate = useNavigate();
    const [coin, setCoin] = useState<CoisProps>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        async function getDetail() {
            try {
                fetch(`https://rest.coincap.io/v3/assets/${id}?apiKey=278241676c5b9f2e836e608c3f1aac29ab497015fed799b4214fee4e397c6284`)
                    .then(Response => Response.json())
                    .then((data: DataProps) => {

                        if ("error" in data) {
                            navigate("/")
                            return
                        }


                        const price = Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD"
                        })
                        const priceCompact = Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            notation: "compact"
                        })


                        const resultData = {
                            ...data.data,
                            formatedPrice: price.format(Number(data.data.priceUsd)),
                            formatedMarket: priceCompact.format(Number(data.data.marketCapUsd)),
                            formatedVolumeUsd: priceCompact.format(Number(data.data.volumeUsd24Hr))
                        }

                        setCoin(resultData)
                        console.log(resultData)
                    })
            } catch (error) {
                console.log(error)
                navigate("/")
            }
        }

        getDetail()
    }, [id])

    if (!loading || !coin) {
        return (
            <div className={styles.container}>
                <h1 className={styles.center}>Carregando detalhes</h1>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.center}>{coin?.name}</h1>
            <h1 className={styles.center}>{coin?.symbol}</h1>
            <section className={styles.content}>
                <img
                    className={styles.logo}
                    src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`}
                    alt="logo" />

                <h1>{coin?.name || coin?.symbol}</h1>
                <p>
                    <strong>Preço: </strong> {coin?.formatedPrice}
                </p>

                <a>
                    <strong>Mercado: </strong> {coin?.formatedMarket}
                </a>

                <a>
                    <strong>Volume: </strong> {coin?.formatedVolumeUsd}
                </a>

                <a><strong>Mudança 24H: </strong>
                    <span className={Number(coin?.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss}>
                        {Number(coin?.changePercent24Hr).toFixed(3)}
                    </span>

                </a>
            </section>
        </div>
    )
} 