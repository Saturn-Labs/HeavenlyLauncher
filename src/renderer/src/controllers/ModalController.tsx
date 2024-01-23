
interface ModalControllerProxy {
  showModal: (mp: ModalProperties) => void;
  hideModal: () => void;
}

const modalControllerProxy: ModalControllerProxy = {
  showModal: () => {},
  hideModal: () => {}
};
export default modalControllerProxy;

export class ModalProperties {
  modalElement: JSX.Element = (<div/>);
}

export class ModalController {
  public static showModal(modalProps: ModalProperties): void {
    modalControllerProxy?.showModal(modalProps);
  }

  public static hideModal(): void {
    modalControllerProxy?.hideModal();
  }
}