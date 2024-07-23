import * as QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import './styles.css';

class BlueScreenGenerator {
    private previewElement: HTMLElement;
    private smileyElement: HTMLElement;
    private contentElement: HTMLElement;
    private messageElement: HTMLElement;
    private message2Element: HTMLElement;
    private progressElement: HTMLElement;
    private qrcodeElement: HTMLCanvasElement;
    private qrText1Element: HTMLElement;
    private qrText2Element: HTMLElement;
    private smileyTopInput: HTMLInputElement;
    private messageInput: HTMLInputElement;
    private message2Input: HTMLInputElement;
    private progressInput: HTMLInputElement;
    private qrInput: HTMLInputElement;
    private qrText1Input: HTMLTextAreaElement;
    private qrText2Input: HTMLTextAreaElement;
    private updateButton: HTMLElement;
    private downloadButton: HTMLElement;

    constructor() {
        this.previewElement = document.getElementById('preview')!;
        this.smileyElement = document.getElementById('smiley')!;
        this.contentElement = document.getElementById('content')!;
        this.messageElement = document.getElementById('message')!;
        this.message2Element = document.getElementById('message2')!;
        this.progressElement = document.getElementById('progress')!;
        this.qrcodeElement = document.getElementById('qrcode') as HTMLCanvasElement;
        this.qrText1Element = document.getElementById('qrText1')!;
        this.qrText2Element = document.getElementById('qrText2')!;
        this.smileyTopInput = document.getElementById('smileyTopInput') as HTMLInputElement;
        this.messageInput = document.getElementById('messageInput') as HTMLInputElement;
        this.message2Input = document.getElementById('message2Input') as HTMLInputElement;
        this.progressInput = document.getElementById('progressInput') as HTMLInputElement;
        this.qrInput = document.getElementById('qrInput') as HTMLInputElement;
        this.qrText1Input = document.getElementById('qrText1Input') as HTMLTextAreaElement;
        this.qrText2Input = document.getElementById('qrText2Input') as HTMLTextAreaElement;
        this.updateButton = document.getElementById('updateButton')!;
        this.downloadButton = document.getElementById('downloadButton')!;

        this.updateButton.addEventListener('click', () => this.updateScreen());
        this.downloadButton.addEventListener('click', () => this.downloadImage());

        // Set initial smiley position and update screen on load
        this.smileyTopInput.value = '250';
        this.updateScreen();
    }

    private updateScreen(): void {
        const smileyTop = parseInt(this.smileyTopInput.value) || 250;
        this.smileyElement.style.top = `${smileyTop}px`;
        this.contentElement.style.paddingTop = `${smileyTop + this.smileyElement.offsetHeight}px`;

        this.messageElement.textContent = this.messageInput.value;
        this.message2Element.textContent = this.message2Input.value;
        this.progressElement.textContent = `${this.progressInput.value}% complete`;
        this.qrText1Element.innerHTML = this.qrText1Input.value.replace(/\n/g, '<br>');
        this.qrText2Element.innerHTML = this.qrText2Input.value.replace(/\n/g, '<br>');

        const qrSize = 128;
        QRCode.toCanvas(this.qrcodeElement, this.qrInput.value || 'https://example.com', {
            width: qrSize,
            margin: 0, // Remove the quiet zone (border)
            color: {
                dark: '#FFF',
                light: '#0078D7'
            }
        }, (error) => {
            if (error) console.error('Error generating QR code:', error);
            
            // Ensure the canvas size matches the QR code size
            this.qrcodeElement.style.width = `${qrSize}px`;
            this.qrcodeElement.style.height = `${qrSize}px`;
        });
    }

    private async downloadImage(): Promise<void> {
        try {
            const canvas = await html2canvas(this.previewElement, {
                scale: 2,
                backgroundColor: '#0078D7',
            });

            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = 'error-screen.png';
                    link.href = url;
                    link.click();
                    URL.revokeObjectURL(url);
                }
            });
        } catch (error) {
            console.error('Error generating image:', error);
        }
    }
}

new BlueScreenGenerator();