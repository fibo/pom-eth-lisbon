import { FC, useMemo } from "react"
import styles from "../styles/ProgressBar.module.css"

type Props = {
  completed: number
}

export const ProgressBar: FC<Props> = ({ completed }) => {
  const style = useMemo(() => ({ width: `${completed}%` }), [completed])

  return (
    <div className={styles.container}>
      <div className={styles.progress} style={style}></div>
    </div>
  )
}
