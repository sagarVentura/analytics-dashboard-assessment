import Papa from "papaparse";

export async function getData() {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch("/Electric_Vehicle_Population_Data.csv"); // CSV file in the public folder
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            const result = await reader.read();
            const csv = decoder.decode(result.value);
      
           

            let results;
            results = Papa.parse(csv, {
                header: true,
                dynamicTyping: true,
            });
            const limitedResults = results.data.slice(0, 1000);
            return resolve(limitedResults);

        }
        catch (err) {
            return reject(err);
        }
    })
}
