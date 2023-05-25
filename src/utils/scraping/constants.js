const urlList = {
    // nike: 'https://www.amazon.com/nike-shoes/s?k=nike+shoes&i=fashion&rh=n%3A7141123011%2Cp_89%3AJordan%7CNike&dc&ds=v1%3A1otG0iy0eQzsQriYTQq16iSH8eMHNiL%2FHU8JDHQ3Svg&qid=1685024245&rnid=2528832011&ref=sr_nr_p_89_3',
    nikeMen: 'https://www.amazon.com/nike-shoes/s?k=nike+shoes&i=fashion&rh=n%3A7141123011%2Cn%3A7147441011%2Cn%3A679255011%2Cp_89%3AJordan%7CNike&dc&ds=v1%3Az7gqeQJkdV8z%2BgENKRS59KbSS92Tb1zxIToErX1I8II&qid=1685049911&rnid=7141123011&ref=sr_nr_n_2',
    nikeWomen: 'https://www.amazon.com/nike-shoes/s?k=nike+shoes&i=fashion&rh=n%3A7141123011%2Cn%3A7147440011%2Cn%3A679337011%2Cp_89%3AJordan%7CNike&dc&ds=v1%3Aj6HKCmugbxBcvC9jjJnS6MqUvbCel0PLTRPqS7zzXc4&qid=1685049942&rnid=7141123011&ref=sr_nr_n_2',

    // adidas: 'https://www.amazon.com/s?k=adidas+shoes&i=fashion&rh=n%3A7141123011%2Cp_89%3Aadidas%7Cadidas+Originals%7Cadidas+outdoor&dc&crid=1GAZHGFC8KFAG&qid=1685026124&rnid=2661617011&sprefix=adidas+shoe%2Caps%2C296&ref=sr_nr_p_72_1&ds=v1%3A8%2F9IkzKaPk9DuYd%2FcVYRG6UT2gFofMaGv1DhWcPOrE8',
    adidasMen: 'https://www.amazon.com/s?k=adidas+shoes&i=fashion&rh=n%3A7141123011%2Cn%3A7147441011%2Cn%3A679255011%2Cp_89%3Aadidas%7Cadidas+Originals%7Cadidas+outdoor&dc&ds=v1%3AuqlGnrja7uSu9031M5vf8DmVnGAjpqbZE739bXtk2zE&crid=1GAZHGFC8KFAG&qid=1685049987&rnid=7141123011&sprefix=adidas+shoe%2Caps%2C296&ref=sr_nr_n_2',
    adidasWomen: 'https://www.amazon.com/s?k=adidas+shoes&i=fashion&rh=n%3A7141123011%2Cn%3A7147440011%2Cn%3A679337011%2Cp_89%3Aadidas%7Cadidas+Originals%7Cadidas+outdoor&dc&ds=v1%3At2BpYVlnHXp9ulZ8HN5EgtFCX2MarRGcyJOwYO4MUss&crid=1GAZHGFC8KFAG&qid=1685049965&rnid=7141123011&sprefix=adidas+shoe%2Caps%2C296&ref=sr_nr_n_2',

    // puma: 'https://www.amazon.com/s?k=puma+shoes&i=fashion&rh=n%3A7141123011%2Cp_89%3APUMA%7CPUMA+GOLF&dc&ds=v1%3A0SamniKa7ABzl0hIH%2Fdg4os4uz2uzFn0EGsN7oLZnGA&crid=3II4SO64WC5IV&qid=1685026158&rnid=2528832011&sprefix=puma+shoes%2Caps%2C223&ref=sr_nr_p_89_2',
    pumaMen: 'https://www.amazon.com/s?k=puma+shoes&i=fashion&rh=n%3A7141123011%2Cn%3A7147441011%2Cn%3A679255011%2Cp_89%3APUMA%7CPUMA+GOLF&dc&ds=v1%3AT%2F0g91ATpqH6Eh7MITSV7EFNculnHuH1h%2FnoTIKoGXU&crid=3II4SO64WC5IV&qid=1685050013&rnid=7141123011&sprefix=puma+shoes%2Caps%2C223&ref=sr_nr_n_2',
    pumaWomen: 'https://www.amazon.com/s?k=puma+shoes&i=fashion&rh=n%3A7141123011%2Cn%3A7147440011%2Cn%3A679337011%2Cp_89%3APUMA%7CPUMA+GOLF&dc&ds=v1%3Abhexxfjze4r9ASoxAgGqKSoDANSf%2B1bFDshs%2B%2FIG1m4&crid=3II4SO64WC5IV&qid=1685050038&rnid=7141123011&sprefix=puma+shoes%2Caps%2C223&ref=sr_nr_n_2',

    // rebook: 'https://www.amazon.com/s?k=reebok+shoes&rh=n%3A7141123011%2Cp_89%3AReebok&dc&ds=v1%3AhQNrUqxtoOtO7Zp%2FQXaxN2%2B%2Fa6jVrdunBjfeiw0bznU&crid=3HQFU8GZ2M49H&qid=1685026194&rnid=2528832011&sprefix=rebook+shoe%2Caps%2C200&ref=sr_nr_p_89_1',
    reebokMen: 'https://www.amazon.com/s?k=reebok+shoes&i=fashion&rh=n%3A7141123011%2Cn%3A7147441011%2Cn%3A679255011%2Cp_89%3AReebok&dc&ds=v1%3AyE%2FQfGBT8lPeep8arbmY5kwk0ZPlVvvWa3TCE%2FknHII&crid=3HQFU8GZ2M49H&qid=1685050068&rnid=7141123011&sprefix=rebook+shoe%2Caps%2C200&ref=sr_nr_n_2',
    reebokWomen: 'https://www.amazon.com/s?k=reebok+shoes&i=fashion&rh=n%3A7141123011%2Cn%3A7147440011%2Cn%3A679337011%2Cp_89%3AReebok&dc&ds=v1%3Ah0kxY6TdSnvyRcsUzDMXbgUfAygqQaVnjp95H9CX%2B94&crid=3HQFU8GZ2M49H&qid=1685050090&rnid=7141123011&sprefix=rebook+shoe%2Caps%2C200&ref=sr_nr_n_2',

    // vans: 'https://www.amazon.com/s?k=vans+shoes&rh=n%3A7141123011%2Cp_89%3AVans&dc&ds=v1%3ArqeLuYRNZCiJl6jWMhbCbgRMFTpnTGyXUxGsU3rzfqE&crid=23U2QHEJEWMF5&qid=1685026220&rnid=2528832011&sprefix=vans+shoe%2Caps%2C267&ref=sr_nr_p_89_1',
    vansMen: 'https://www.amazon.com/s?k=vans+shoes&i=fashion&rh=n%3A7141123011%2Cn%3A7147441011%2Cn%3A679255011%2Cp_89%3AVans&dc&ds=v1%3A9A6OFMMa2fOPgTml27mHGxOYBWtl4B1xVYYrUOGiibU&crid=23U2QHEJEWMF5&qid=1685050178&rnid=7141123011&sprefix=vans+shoe%2Caps%2C267&ref=sr_nr_n_2',
    vansWomen: 'https://www.amazon.com/s?k=vans+shoes&i=fashion&rh=n%3A7141123011%2Cn%3A7147440011%2Cn%3A679337011%2Cp_89%3AVans&dc&ds=v1%3AglKHSamVywYK7bcBNpcwkw5%2Fu6hwR8u6bJLUw5vNFXk&crid=23U2QHEJEWMF5&qid=1685050140&rnid=7141123011&sprefix=vans+shoe%2Caps%2C267&ref=sr_nr_n_2',

    // converse: 'https://www.amazon.com/s?k=converse+shoes&rh=n%3A7141123011%2Cp_89%3AConverse&dc&ds=v1%3APrGjephFlhc68oexcsJUVOLZUlQt4jGJAio%2BRg1WPLU&crid=1VJ961VLH2HII&qid=1685026241&rnid=2528832011&sprefix=converse+shoes%2Caps%2C208&ref=sr_nr_p_89_1',
    converseMen: 'https://www.amazon.com/s?k=converse+shoes&i=fashion&rh=n%3A7141123011%2Cn%3A7147441011%2Cn%3A679255011%2Cp_89%3AConverse&dc&ds=v1%3AOQQxGkDGwpSkt8pPMzXgzA9hMBkJJ8FKLr59oZQFoto&crid=1VJ961VLH2HII&qid=1685046261&rnid=7141123011&sprefix=converse+shoes%2Caps%2C208&ref=sr_nr_n_2',
    converseWomen: 'https://www.amazon.com/s?k=converse+shoes&i=fashion&rh=n%3A7141123011%2Cn%3A7147440011%2Cn%3A679337011%2Cp_89%3AConverse&dc&page=2&crid=1VJ961VLH2HII&qid=1685046354&rnid=7141123011&sprefix=converse+shoes%2Caps%2C208&ref=sr_pg_2',

    newbalanceMen: 'https://www.amazon.com/s?k=new+balance+shoes&i=fashion&rh=n%3A7141123011%2Cn%3A7147441011%2Cn%3A679255011&dc&ds=v1%3APZr0ttrDPMQoRapB4J2oab6bkgr7bU%2Blk%2FEvVGTHkqE&crid=2G9ZM40QZBH41&qid=1685050239&rnid=7141123011&sprefix=new+balance+shoes%2Cfashion-mens-shoes%2C235&ref=sr_nr_n_2',
    newBalanceWomen: 'https://www.amazon.com/s?k=new+balance+shoes&i=fashion&rh=n%3A7141123011%2Cn%3A7147440011%2Cn%3A679337011&dc&ds=v1%3AQFyNvHmyr%2FmVKEnBK0GLzGcTQYR5hP5MLF%2FId8DwTyw&crid=2G9ZM40QZBH41&qid=1685050271&rnid=7141123011&sprefix=new+balance+shoes%2Cfashion-mens-shoes%2C235&ref=sr_nr_n_2',
}

module.exports = {
    urlList
};

