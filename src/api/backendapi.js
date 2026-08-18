
export const getProducts = async () => {
    try {
        const response = await fetch("https://react-assigment-backend.vercel.app/products");
        if (!response.ok) {
            throw new Error('Data fetch nahi hua');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
};