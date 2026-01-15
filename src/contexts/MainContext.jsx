import { createContext, useEffect, useState } from "react";
import { areaService } from "../services";

export const MainContext = createContext();

export const MainProvider = ({ children }) => {
    const [areas, setAreas] = useState(null);
    const [areaSelected, setAreaSelected] = useState(null);
    const getAllAreas = async () => {
        try {
            const response = await areaService.getAllAreas();
            setAreas(response);
            if (response && response.length > 0) {
                const areaId = localStorage.getItem('areaId');
                const area = areaId || response[0]._id;
                setAreaSelected(area);
            }
        } catch (error) {
            console.log(error)
            alert('Error al obtener las áreas');
        }
    }
    useEffect(() => {
        if (areaSelected) {
            localStorage.setItem('areaId', areaSelected);
        }
    }, [areaSelected])
    useEffect(() => {
        getAllAreas();
    }, []);
    return (
        <MainContext.Provider value={{ areas, areaSelected, setAreaSelected }}>
            {children}
        </MainContext.Provider>
    );
}


