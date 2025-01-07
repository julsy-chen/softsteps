import React from "react";

export function NavBar({showNavBar}) {
    return (
        <>
            <div className={showNavBar ? "sidebar active" : "sidebar"}>
                <ul>
                    <li>
                        <a href="/"> Page 1 </a>
                    </li>
                </ul>
            </div>
        </>
    );
}