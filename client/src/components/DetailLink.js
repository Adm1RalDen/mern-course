export const LinkDetail = ({data: {_id, clicks, to, from, owner, data}}) => {

    return <div>
        <div className="collection">
            <a href="#!" className="collection-item"><span className="badge">{_id}</span>Айди:</a>
            <a href="#!" className="collection-item"><span className="badge">{clicks}</span>Количество переходов:</a>
            <a href="#!" className="collection-item"><span className="badge">{to}</span>Откуда</a>
            <a href="#!" className="collection-item"><span className="badge">{from}</span>Куда</a>
            <a href="#!" className="collection-item"><span className="badge">{owner}</span>Айди пользователя:</a>
            <a href="#!" className="collection-item"><span className="badge">{data}</span>Дата создания:</a>
        </div>
    </div>
}