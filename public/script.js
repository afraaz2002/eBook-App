
let searchInput = document.querySelector(".hiddenInput");
let search = document.querySelector(".search");
let searchBtn = document.querySelector("#searchBtn");
let next = document.querySelectorAll(".arrow-right");
let prev = document.querySelectorAll(".arrow-left");
let fact=document.querySelector("#fact");
let sidebarBtn = document.querySelector("#sidebar");
let sideMenu = document.querySelector(".side-menu");
let sideMenuClose = document.querySelector(".close");

let cardWidth;
let vpWidth = window.innerWidth;

if (vpWidth >= 1400) {
    cardWidth = vpWidth / 4;
} else {
    cardWidth = vpWidth / 3.7;
}

const randomFact = () => {

   const facts = ["The first ebook in the world was released on July 4, 1971. It is the US Declaration of Independence. In 1971, passionate technologist and futurist Michael Stern Hart, inspired by a free printed copy of the Declaration of Independence.","Independently published books account for 43% of all Kindle books sold on Amazon, while small publishers where many of which are actually indie authors which account for 17% of all Kindle books sold on Amazon.","Ebooks can be interactive, with audio, video, animations, and links. Amazon is even pioneering moving ebook covers and chapter headings. The size on these ebooks is huge, however, so space might become a problem after awhile.","The highest number of pages in an ebook we have found so far is the New Testament commentary series by preacher John MacArthur. The book includes the entire collection – 33 volumes. It was released in 2015, and costs over $400","The ebook, Gambler’s Nook, was offered on a multimedia CD. Blagg distributed it through her company Books OnScreen and then Pagefree Publishing to major retailers including Barnes & Noble and Amazon.","The ebook was released in March 2000 by Simon & Schuster, and available for download in pdf format at $2.50. The huge demand in the first hours caused the servers to jam. Readers had to wait for hours for the file to download.","The first Digital Bookmobile started in Central Park in August 2008. Operated by OverDrive, it is designed to teach readers how to access digital books and audiobooks.In the first 10 years, the Digital Bookmobile was visited by 225,000 readers of all ages","In May 2011, Amazon announced that Kindle ebook sales surpassed all print book sales – both hardcover and paperback. Sine April 1, for every 1f00 paper books purchased on Amazon, 105 Kindle ebooks were bought","A vast majority of school libraries report collections of up to 25,000 volumes. This number of book files can be stored on every e-reader that’s equipped with 32 GB of internal memory, such as Kindle Paperwhite or Oasis."
    ];

    let rand = Math.floor(Math.random() * facts.length);
    fact.innerHTML = facts[rand];

}
randomFact();

sidebarBtn.addEventListener("click",() => {
    sideMenu.classList.add("open");
})

sideMenuClose.addEventListener("click",() => {
    sideMenu.classList.remove("open");
})

search.addEventListener("click", () => {
    searchInput.focus();
    searchInput.classList.toggle("grow");

    if (searchInput.classList.contains("grow")) {
        searchBtn.innerHTML = `
           <button type="submit" class="fas fa-search"></button>
        `
    }
    else {
        searchBtn.innerHTML = `
           <i class="fas fa-search"></i>
        `
    }
})

next.forEach((slider) => {
    slider.addEventListener('click', (e) => {
        let sliderToScroll = e.currentTarget.previousElementSibling;
        sliderToScroll.scrollLeft += cardWidth;
    })
})

prev.forEach((slider) => {
    slider.addEventListener('click', (e) => {
        let sliderToScroll = e.currentTarget.nextElementSibling;
        sliderToScroll.scrollLeft -= cardWidth;
    })
})
