import { createContext, useState } from "react";

export const useStudioAPIContext = () => {
    const [studios, setStudios] = useState([]);

    return {
        studios,
        setStudios
    }

}
const StudiosAPIContext = createContext({
    studios: null,
    setStudios: () => {},
})
export default StudiosAPIContext;