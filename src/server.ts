import app from './app';
import config from './app/config';

async function main() {
  try {
    app.listen(config.PORT, () => {
      console.log('App is listening on port', config.PORT);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
