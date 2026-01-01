"use client";

// React
import { useState, useEffect } from "react";

export default function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsIOS(
            /iPad|iPhone|iPod/.test(navigator.userAgent) &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                !(window as any).MSStream
        );

        setIsStandalone(
            window.matchMedia("(display-mode: standalone)").matches
        );
    }, []);

    if (isStandalone) {
        return null; 
    }

    return (
        <div>
            <h3>Install App</h3>
            <button>Add to Home Screen</button>
            {isIOS && (
                <p>
                    To install this app on your iOS device, tap the share button
                    <span role="img" aria-label="share icon">
                        {" "}
                        ⎋{" "}
                    </span>
                    and then &quot;Add to Home Screen&quot;
                    <span role="img" aria-label="plus icon">
                        {" "}
                        ➕{" "}
                    </span>
                    .
                </p>
            )}
        </div>
    );
}
