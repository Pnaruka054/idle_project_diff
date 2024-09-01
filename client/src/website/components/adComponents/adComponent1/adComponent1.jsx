import { useEffect } from 'react';

const AdComponent1 = ({ adKey, width, height }) => {
    useEffect(() => {
        const existingScripts = document.querySelectorAll('#ad_container script');
        existingScripts.forEach(script => script.remove());
        const script1 = document.createElement("script");
        script1.type = 'text/javascript';
        script1.innerHTML = `
            atOptions = {
                'key' : '${adKey}',
                'format' : 'iframe',
                'height' : ${height},
                'width' : ${width},
                'params' : {}
            };
        `;
        document.getElementById('ad_container').appendChild(script1);

        const script2 = document.createElement('script');
        script2.type = 'text/javascript';
        script2.src = `//www.topcreativeformat.com/${adKey}/invoke.js`;
        document.getElementById('ad_container').appendChild(script2);
    }, [adKey, width, height]);

    return <div id="ad_container"></div>;
};

export default AdComponent1;
