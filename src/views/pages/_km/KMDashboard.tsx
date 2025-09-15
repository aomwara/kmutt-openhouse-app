import { useEffect, useState } from "react";
import KMLayout from "@/views/layouts/KMLayout";

const KMDashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("/api/km/km-only")
            .then((res) => res.json())
            .then((d) => setData(d));
    }, []);

    return (
        <KMLayout >
            <h1 className="text-xl text-white font-bold">🎓 KM Dashboard</h1>
            <pre className="mt-4 bg-gray-100 p-4 rounded-lg text-gray-800">
                {JSON.stringify(data, null, 2)}
            </pre>
        </KMLayout>
    );
}

export { KMDashboard };