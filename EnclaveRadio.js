class EnclaveRadio
{
    constructor()
    {
        this.playlist = [];
        this.selected = {
            music: 0,
            quote: 0,
            theme: 0
        }
        this.music = [
            new Audio("radio/enclave/music/anthem.mp3"),
            new Audio("radio/enclave/music/ceremonial-march-past.ogg"),
            new Audio("radio/enclave/music/stars-n-stripes-forever.ogg"),
            new Audio("radio/enclave/music/the-washington-post.ogg"),
        ]
        this.themes = [
            new Audio("radio/enclave/themes/baseball.ogg"),
            new Audio("radio/enclave/themes/children.mp3"),
            new Audio("radio/enclave/themes/elections.mp3"),
            new Audio("radio/enclave/themes/enclave.ogg"),
            new Audio("radio/enclave/themes/enemies.mp3"),
            new Audio("radio/enclave/themes/situation.mp3"),
            new Audio("radio/enclave/themes/thirst.ogg"),
        ]
        this.quotes = [
            new Audio("radio/enclave/quotes/quote1.ogg"),
            new Audio("radio/enclave/quotes/quote2.ogg"),
            new Audio("radio/enclave/quotes/quote3.ogg"),
            new Audio("radio/enclave/quotes/quote4.ogg"),
            new Audio("radio/enclave/quotes/quote5.ogg"),
            new Audio("radio/enclave/quotes/quote6.ogg"),
            new Audio("radio/enclave/quotes/quote7.ogg"),
            new Audio("radio/enclave/quotes/quote8.ogg"),
        ]
        for (let i = 0; i < 25; i++)
        {
            /*
                В оригинальном радио пропаганда чередуется музыкой 1 к 1
            */
            if(i % 2 == 0)
            {
                this.playlist.push(this.music[this.selected.music]);
                this.selected.music += 1;
                if(this.selected.music >= this.music.length) this.selected.music = 0;
            }
            else
            {
                this.playlist.push(this.themes[this.selected.theme]);
                this.selected.theme += 1;
                if(this.selected.theme >= this.themes.length) this.selected.theme = 0;
            }
        }
        this.radio = new RadioStation(this.playlist);
    }
    play()
    {
        this.radio.play();
    }
    stop()
    {
        this.radio.stop();
    }
}