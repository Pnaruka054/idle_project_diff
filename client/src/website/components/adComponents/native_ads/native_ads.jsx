import { useEffect } from 'react';

const Native_Ads = ({ scriptSrc, containerId }) => {
    useEffect(() => {
        // Create and append the script
        const script = document.createElement('script');
        script.async = true;
        script.src = scriptSrc;
        document.body.appendChild(script);

        // Cleanup script on component unmount
        return () => {
            document.body.removeChild(script);
        };
    }, [scriptSrc]);

    return (
        <div id={containerId}>
            {/* The ad will be injected into this container */}
        </div>
    );
};

export default Native_Ads;