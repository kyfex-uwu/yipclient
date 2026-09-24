import { defineConfig } from 'orval';

export default defineConfig({
    barq: {
        input: "https://api.barq.app/api/docs/json",
        output:{
            target:"src/api.ts",
            headers:true,
            client:"fetch",

            override:{
                mutator:{
                    path:"src/fetchWithAuth.ts",
                    name:"fetchWithAuth"
                }
            }
        }
    },
});