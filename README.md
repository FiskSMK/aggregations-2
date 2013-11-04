# Agregacje 2

![Data Wranglers](/images/data-wrangler.jpg)

Do aggregacji można wykorzystać te kolekcje:

* *census1881*
* *zipcodes*, [przykładowe agregacje](/Aggregation-Framework-Examples-in-Javascript.md)
* *imieniny*, [przykładowe agregacje](/Aggregation-Framework-Examples-in-Javascript.md)
* *poland* – Open Street Data dla Polski
* *airports* (B. Bedra)

Kolekcje zostały zaimportowane do bazy MongoDB działającej na maszynie
wirtualnej. Do maszyny logujemy się w ten sposób:

```sh
mongo --username student --password sesja2013 153.19.1.202/test
```

*Uwaga:* Użytkownik *student* ma uprawnienia tylko do odczytu w bazie  *test*.


## Nasze agregacje

1. Bzyl, Włodzimierz. [Imieniny](/docs/wbzyl.md).
1. Bełcik, Jakub.
1. Białkowski, Dominik.
1. Brzeziński, Damian.
1. Cała, Mariusz.
1. [Dermont, Jacek](/docs/jdermont.md).
1. Detlaf, Krzysztof.
1. Dępczyk, Michał.
1. Dobrzycki, Wojciech.
1. Dolata, Jędrzej.
1. Domurat, Szymon.
1. Duwe, Oskar.
1. Elszkowski, Adrian.
1. Gałka, Jacek.
1. Głowacki, Michał.
1. Gniado, Bartosz.
1. Groszek, Rafał.
1. Januszewski, Tomasz.
1. Jaźwiński, Robert.
1. Karczewski, Kamil.
1. [Karwowski, Kamil](/docs/kkarwowski.md).
1. Kłeczek, Piotr.
1. Kotłowski, Piotr.
1. Koźmiński, Marcin.
1. [Królik, Przemysław](/docs/pkrolik.md).
1. Kubacki, Konrad.
1. [Kwiatkowski, Mateusz](/docs/mkwiatkowski.md)
1. [Lewandowska, Marta] (/docs/mlewandowska.md)
1. Łuczun, Rafał.
1. Malinowski, Piotr.
1. [Małecki, Maciej](/docs/mmalecki/README.md).
1. Matulewski, Damian.
1. Melzer, Grzegorz.
1. Mieszała, Konrad.
1. [Motel, Mateusz](/docs/mmotel/zadanie1.md).
1. Motławski, Mateusz.
1. Napiórkowski, Sebastain.
1. Osękowski, Dominik.
1. [Osiński, Miłosz](/docs/mosinski/README.md).
1. Ostrowski, Michał.
1. [Paczyński, Łukasz](/docs/lpaczynski/README.md).
1. Piasecka, Aleksandra.
1. Pietraszuk, Bartłomiej.
1. [Pikora, Mateusz](/docs/mpikora/zadanie1.md).
1. Plichta, Oskar.
1. [Puchalski, Paweł](/docs/ppuchalski/README.md).
1. Rogaszewski, Piotr.
1. Rybarczyk, Karolina.
1. Sawicki, Paweł.
1. Siora, Kacper.
1. [Skiba, Marek](/docs/mskiba/README.md).
1. Skowroński, Krzysztof.
1. Smykowski, Adrian.
1. Sott, Tomasz.
1. Stefanowicz, Michał.
1. [Szygenda, Mateusz](/docs/mszygenda.md)
1. Tomczak, Robert.
1. [Wąsowicz, Michał](/docs/mwasowicz.md).
1. Winsławski, Bartłomiej.
1. Wiśniewski, Konrad.
1. Wiśniewski, Piotr.
1. Zdunek, Kamil.
1. Żarkowski, Mateusz.


## BigData

[GetGlue and Timestamped Event Data](http://getglue-data.s3.amazonaws.com/getglue_sample.tar.gz)
(ok. 11 GB, 19_831_300 json-ów, próbka 100 jsonów [getglue101](/data/wbzyl/getglue101.json)):

```json
{
  "_id": ObjectId("5276918832cf3c2b84540440"),
  "comment": "",
  "modelName": "movies",
  "displayName": "",
  "title": "The Dark Knight",
  "timestamp": "2008-10-28T16:47:31Z",
  "image": "http://ia.media-imdb.com/images/...@@._V1._SX94_SY140_.jpg",
  "userId": "sippey",
  "private": "false",
  "director": "Christopher Nolan",
  "source": "http://www.imdb.com/title/tt0468569/",
  "version": "1",
  "link": "http://www.imdb.com/title/tt0468569/",
  "lastModified": "2011-12-16T19:39:33Z",
  "action": "Liked",
  "lctitle": "the dark knight",
  "objectKey": "movies/dark_knight/christopher_nolan"
}
```

Dane z lat 2007–2012, tylko filmy i przedstawienia TV.

Przykładowe aggregacje i zliczania: ilu jest różnych użytkowników
w danych? jakie jest 10 najpopularniejszych filmów i przedstawień TV?
ile jest różnych akcji?


## Ściąga z Gita

* Scott Chacon, [Pro Git](http://git-scm.com/book);
  [niekompletne tłumaczenie na język polski](http://git-scm.com/book/pl).

Dwa sposoby radzenia sobie z taką sytuacją:
**We can’t automatically merge this pull request.**

Sposób 1:

```sh
git remote add miotla007 git://github.com/miotla007/aggregations-2.git
git fetch miotla007
git merge miotla007/master
  .. edycja .. rozwiązywanie konfliktów
git push origin master

git remote rm miotla007
```

Sposób 2 (sugerowany przez GitHub Team):

```sh
git checkout -b miotla007-master master
git pull git://github.com/miotla007/aggregations-2.git master
git checkout master
git merge miotla007-master
git push origin master

git branch -d miotla007-master
```

Undo różnych rzeczy:

```sh
git reset --merge           # merge
git reset --hard ORIG_HEAD  # rebase
```

> Another common practice is to rebase
> the last few commits in your current branch
>
> [Interactive rebase](https://help.github.com/articles/interactive-rebase) on GitHub

Jak zmniejszyć liczbę commitów, zmienić ich kolejność i przeredagować wpisy log:

```sh
git checkout issue16                       # o ile commity są na tej gałęzi
git log --pretty=oneline HEAD~6..HEAD      # sprawdzamy które commity będziemy zmieniać
git rebase -i HEAD~6                       # poprawiamy ostatnich 6 commitów

.. edycja ..
....  edit -- jeśli chcemy poprawić ten commit lub coś do niego dodać
........  git reset HEAD^  # rollback the last commit
........  git status
........  git add --patch  # lub dodajemy/edytujemy pliki
........
........  git rebase --contiune
....  reword -- poprawiamy tekst wpisu do log

git log --pretty=oneline
git rebase master                          # o ile jesteśmy na gałęzi issue16
git checkout master
git merge issue16
git branch -d issue16                      # możemy usunąć scaloną gałąź
```

Na stronie manuala *gitrevisions* jest opisane znaczenie:
`HEAD^`, `^HEAD`, `HEAD~n`.

Stashing:

```sh
git stash
git stash list
git stash apply stash@{0}  # przykłady
git stash drop  stash@{0}
```

Zobacz też:

* Mark Dominus
  - [Why can't Git resolve all conflicted merges?](http://blog.plover.com/prog/git-merge.html)
  - [My Git Habits](http://blog.plover.com/prog/git-habits.html)
* Bert Belder, [Checkout github pull requests locally](https://gist.github.com/piscisaureus/3342247)
* Chris Wanstrath, [hub makes git better with GitHub](http://defunkt.io/hub/)
* Scott Chacon, [6.4 Git Tools - Rewriting History](http://git-scm.com/book/en/Git-Tools-Rewriting-History)
