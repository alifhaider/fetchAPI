import React, { useState, useEffect } from "react";
import axios from "axios";

const Intermediate = () => {
  const [primaryLocation, setPrimaryLocation] = useState({
    headers: [],
    data: [],
  });
  const [sortingDirections, setSortingDirections] = useState("");
  const [inputValue, setInputValue] = useState("");

  //------------Fetching API--------------
  const fetchUser = () => {
    return axios
      .get(`https://randomuser.me/api/?results=20`)
      .then((res) => {
        const { results } = res.data;
        //console.log(results);
        return results;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchUser().then((apiPeople) => {
      const ourPrimaryLocations = pLocations(
        apiPeople.map(({ location }) => location)
      );
      setPrimaryLocation(ourPrimaryLocations);
      const { headers } = ourPrimaryLocations;

      const ourSortingDirections = {};
      for (let header of headers) {
        ourSortingDirections[header] = "UNSORTED"; //Sets default sorting as Unsorted
      }
      setSortingDirections(ourSortingDirections);
    });
  }, []);

  const pLocations = (locations) => {
    //console.log(locations);
    const location = locations[0];
    const flattenedLocationsHeaders = extractObjectKeys(location);
    const data = [];
    for (const { street, coordinates, timezone, ...rest } of locations) {
      data.push({
        ...rest,
        number: street.number,
        name: street.name,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
    }
    return { headers: flattenedLocationsHeaders, data };
  };

  //----------Handling Headers and Values of the body rows-----------
  const extractObjectKeys = (object) => {
    let objectKeys = [];
    Object.keys(object).forEach((objectKey) => {
      const value = object[objectKey];
      if (typeof value !== "object") {
        objectKeys.push(objectKey);
      } else {
        objectKeys = [...objectKeys, ...extractObjectKeys(value)];
      }
    });
    return objectKeys;
  };

  // --------------Stores each column sorting as the current state & changes A/D -----------
  const sortColumn = (sortKey) => {
    //console.log(sortKey);
    const newFlattenedLocations = {
      ...primaryLocation,
      data: [...primaryLocation.data],
    };

    const currentSortingDirection = sortingDirections[sortKey];

    sortData(newFlattenedLocations.data, sortKey, currentSortingDirection);
    const nextSortingDirection = getNextSortingDirection(
      currentSortingDirection
    );

    const newSortingDirections = { ...sortingDirections };
    newSortingDirections[sortKey] = nextSortingDirection;
    setPrimaryLocation(newFlattenedLocations);
    setSortingDirections(newSortingDirections);
    //console.log(newFlattenedLocations);
  };

  //---------Sort Function ------------
  const sortData = (data, sortKey, sortingDirection) => {
    data.sort((a, b) => {
      const relevantValueA = a[sortKey];
      const relevantValueB = b[sortKey];
      if (sortingDirection === "UNSORTED" || sortingDirection === "ASCENDING") {
        if (relevantValueA < relevantValueB) return -1;
        if (relevantValueA > relevantValueB) return 1;
        return 0;
      } else {
        if (relevantValueA > relevantValueB) return -1;
        if (relevantValueA < relevantValueB) return 1;
        return 0;
      }
    });
  };

  //Returns Filtered Row
  const getFilterRows = (rows, filter) => {
    return rows.filter((row) => JSON.stringify(row).includes(filter));
  };

  const getNextSortingDirection = (sortingDirection) => {
    if (sortingDirection === "UNSORTED" || sortingDirection === "ASCENDING") {
      return "DESCENDING";
    }
    return "ASCENDING";
  };

  return (
    <div>
      <input
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
      <table>
        <thead>
          <tr>
            {primaryLocation.headers.map((locationString, locationIdx) => (
              <th
                key={locationIdx}
                onClick={() => {
                  sortColumn(locationString);
                }}
              >
                {locationString}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {getFilterRows(primaryLocation.data, inputValue).map(
            (location, locationIdx) => (
              <tr key={locationIdx}>
                {primaryLocation.headers.map((header, headerIdx) => (
                  <td key={headerIdx}>{location[header]}</td>
                ))}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Intermediate;
