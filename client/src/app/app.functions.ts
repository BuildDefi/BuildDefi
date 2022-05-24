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
  message = `erro inesperado`,
  header = `Ocorreu um erro`
) => {
  return async (error?: any) => {
    if (error) {
      message = error.error && error.error.join ? error.error.join('. ') : error.message;

      header = 'Erro de autorização';
      if (message.startsWith('missing provider')) {
        message = 'Provedor não encontrado, tente instalar Metamask!';
      } else if (message === 'User rejected the request.') {
        message = 'Você precisa autorizar o acesso a carteira.';
      } else if (message === 'A request is already in progress') {
        message = 'Informe suas credenciais para se autenticar';
      } else if (message === 'WrongChainId') {
        message = 'Você deve estar conectado na rede localhost!';
      } else {
        console.error(error);
      }
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