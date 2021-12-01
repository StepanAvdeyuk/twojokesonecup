import "./404.scss";
import { Link } from "react-router-dom";

const Page404 = () => {
    return (
        <div className="p404__wrapper">
            <div className="container">
                <div className="p404">4<span>0</span>4</div>
                <div className="p404__text">Здесь шуток не будет...</div>
                <Link as="button" className="p404__btn" to="/">Вернуться на главную</Link>
            </div>
        </div>
    )
}

export default Page404;