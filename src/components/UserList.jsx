import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import InfiniteScroll from "react-infinite-scroll-component";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [lastId, setLastId] = useState(0);
    const [tempId, setTempId] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [query, setQuery] = useState("");
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        getUsers();
    }, [lastId, keyword]);

    const getUsers = async () => {
        const response = await axios.get(
            `http://localhost:5000/users?search_query=${keyword}&lastId=${lastId}&limit=100`
        );
        const newUsers = response.data.result;
        setUsers([...users, ...newUsers]);
        setTempId(response.data.lastId);
        setHasMore(response.data.hasMore);
    };

    const fetchMore = () => {
        setLastId(tempId);
    };

    const searchData = (e) => {
        e.preventDefault();
        setLastId(0);
        setUsers([]);
        setKeyword(query);
    };

    return (
        <div className="container mt-5">
            <div className="columns">
                <div className="column is-centered">
                    <form onSubmit={searchData}>
                        <div className="field has-addons">
                            <div className="control is-expanded">
                                <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Fiend Something Here..." />
                            </div>
                            <div className="control">
                                <button className="button is-info" type='submit'> Search</button>
                            </div>
                        </div>
                    </form>
                    <InfiniteScroll
                        dataLength={users.length}
                        next={fetchMore}
                        hasMore={hasMore}
                        loader={<h4>Loading...</h4>}
                    >
                        <table className='table is-striped is-bordered is-fullwidth mt-2'>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Gender</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.gender}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    )
}
