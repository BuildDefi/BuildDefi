import { AlertController, LoadingController, ToastController } from "@ionic/angular";

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
      } else if (message.endsWith('caller is not the owner')) {
        message = 'Você não possui permissão para fazer isso!'
      } else if (message.includes('invalid address')) {
        message = 'Endereço inválido!'
      } else if (message === 'UndefinedContract') {
        message = 'Conecte-se com uma carteira primeiro!'
      } else if (message === 'User rejected the transaction') {
        message = 'Operação cancelada pelo usuário!';
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


export const appCopyToClipboard = async (
  toastCtrl: ToastController,
  text: string,
  message = 'Texto copiado com sucesso.'
) => {
  const el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  const toast = await toastCtrl.create({
    message, duration: 1000
  });
  toast.present();
}