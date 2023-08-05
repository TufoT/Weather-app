import React from "react";
import WeatherApp from "./WeatherApp";

const App = () => {

    const handleOnSearchChange = (searchData) => {
        console.log(searchData)
    }

    return (
        <WeatherApp />
    )
}

export default App