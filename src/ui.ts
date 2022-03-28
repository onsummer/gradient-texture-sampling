export const buildUI = (app: HTMLDivElement, callback: (item: string) => void) => {
  const div = document.createElement('div')
  div.style.display = 'flex';
  div.style.justifyContent = 'center';
  div.style.alignItems = 'center';

  (['rainbow', 'black_white', 'green_white']).forEach((item) => {
    const btn = document.createElement('button')
    btn.innerHTML = item
    btn.onclick = () => {
      callback(item)
    }

    div.appendChild(btn)
  })

  app.appendChild(div)
}