import React, { useState, createContext, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface ComponentProp {
    show_nav_bar: boolean;
    setShowNavBar: (show_nav_bar: boolean) => void;
    isDarkTheme:boolean
    setIsDarkTheme:(isDarkTheme:boolean)=>void
}

const ComponentContext = createContext<ComponentProp | null>(null);

const ComponentProvider: React.FC = () => {
    const [show_nav_bar, setShowNavBar] = useState<boolean>(false);
    const [isDarkTheme,setIsDarkTheme]=useState<boolean>(false)
    return (
        <ComponentContext.Provider value={{ show_nav_bar, setShowNavBar,isDarkTheme,setIsDarkTheme }}>
           <Outlet/>
        </ComponentContext.Provider>
    );
};

export { ComponentContext, ComponentProvider };
