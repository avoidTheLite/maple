import './loadEnv.ts';
import { app } from './app.ts';

const PORT = process.env['PORT'] ?? 3001;

app.listen(PORT, () => {
  console.log(`@maple/api running on port ${PORT}`);
});
