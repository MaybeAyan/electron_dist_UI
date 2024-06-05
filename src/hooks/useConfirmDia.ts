import { DialogPlugin } from 'tdesign-vue-next'

interface IConfirmParams {
  title: string
  body: string
  confirmTxt: string
  cancelTxt: string
  onConfirm?: () => Promise<void>
  onClose?: () => Promise<void>
}

const useConfirmDia = () => {
  const handleConfirm = (options: IConfirmParams) => {
    const confirmDia = DialogPlugin.confirm({
      header: options.title,
      body: options.body,
      confirmBtn: options.confirmTxt,
      cancelBtn: options.cancelTxt,
      onConfirm: () => {
        options.onConfirm && options.onConfirm()
        confirmDia.destroy()
      },
      onClose: () => {
        options.onClose && options.onClose()
        confirmDia.hide()
      }
    })
  }

  return { handleConfirm }
}

export default useConfirmDia
