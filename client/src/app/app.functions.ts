import { AlertController, LoadingController } from "@ionic/angular";

export const appShowLoading = async (
  loadingCtrl: LoadingController
) => {
  const loading = await loadingCtrl.create({
    message: 'Carregando...'
  });
  loading.present();

  return loading;
}

export const appCatchError = (
  alertCtrl: AlertController,
  message = `Tente novamente, mais tarde`,
  header = `Ocorreu um erro`
) => {
  return async (error?: any) => {
    if (error) {
      message = error.error && error.error.join ? error.error.join('. ') : error.message;
    }

    const alert = await alertCtrl.create({
      header: header,
      message: message,
      buttons: ['Ok']
    });
    alert.present();
    await alert.onDidDismiss();
  }
}