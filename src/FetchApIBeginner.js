import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const FetchApIBeginner = () => {
  const [count, setCount] = useState(0);
  const [userData, setUserData] = useState("");
  const [userInfos, setUserInfos] = useState([]);
  const [nextPageNumber, setNextPageNumber] = useState(1);

  const fetchNextUser = async () => {
    const randomData = await fetchUser(nextPageNumber);
    //setUserData(JSON.stringify(randomData, null, 2));
    if (randomData === undefined) return;
    const newUserInfos = [...userInfos, ...randomData.results];
    setUserInfos(newUserInfos);
    setNextPageNumber(randomData.info.page + 1);
  };

  useEffect(() => {
    //fetch Next User
    // const randomData = await fetchUser(nextPageNumber);
    // setUserData(JSON.stringify(randomData, null, 2));
    // setUserInfos(randomData.results);
    // setNextPageNumber(randomData.info.page + 1);
    fetchNextUser();
  }, []);

  const getFullName = (userInfo) => {
    const {
      name: { title, first, last },
    } = userInfo;
    return `${title}. ${first} ${last}`;
  };

  const fetchUser = (pageNumber) => {
    return axios
      .get(`https://randomuser.me/api/?page=${pageNumber}`)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="App">
      <p>{count}</p>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        {" "}
        Increase Count
      </button>
      <button
        onClick={() => {
          fetchNextUser();
        }}
      >
        {" "}
        Fetch Next User{" "}
      </button>
      {userInfos.map((userInfo, idx) => (
        <div key={idx}>
          <h3>{getFullName(userInfo)}</h3>
          <img src={userInfo.picture.thumbnail} />
        </div>
      ))}
      <p>{nextPageNumber}</p>
      <pre>{userData}</pre>
    </div>
  );
};

export default FetchApIBeginner;
