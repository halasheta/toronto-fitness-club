import { createContext, useState } from "react";

export const useClassesAPIContext = () => {
    const [classes, setClasses] = useState([]);

    return {
        classes,
        setClasses
    }

}
const ClassesAPIContext = createContext({
    classes: null,
    setClasses: () => {},
})
export default ClassesAPIContext;