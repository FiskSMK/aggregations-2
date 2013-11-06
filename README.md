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
1. Karwowski, Kamil.
1. Kłeczek, Piotr.
1. Kotłowski, Piotr.
1. Koźmiński, Marcin.
1. Królik, Przemysław.
1. Kubacki, Konrad.
1. Kwiatkowski, Mateusz.
1. Lewandowska, Marta.
1. Łuczun, Rafał.
1. Malinowski, Piotr.
1. [Małecki, Maciej](/docs/mmalecki/README.md).
1. Matulewski, Damian.
1. Melzer, Grzegorz.
1. Mieszała, Konrad.
1. Motel, Mateusz.
1. Motławski, Mateusz.
1. Napiórkowski, Sebastain.
1. Osękowski, Dominik.
1. [Osiński, Miłosz](/docs/mosinski/README.md).
1. Ostrowski, Michał.
1. Paczyński, Łukasz.
1. Piasecka, Aleksandra.
1. Pietraszuk, Bartłomiej.
1. [Pikora, Mateusz](/docs/mpikora/zadanie1.md).
1. Plichta, Oskar.
1. Puchalski, Paweł.
1. Rogaszewski, Piotr.
1. Rybarczyk, Karolina.
1. Sawicki, Paweł.
1. Siora, Kacper.
1. Skiba, Marek.
1. Skowroński, Krzysztof.
1. Smykowski, Adrian.
1. Sott, Tomasz.
1. Stefanowicz, Michał.
1. Szygenda, Mateusz.
1. Tomczak, Robert.
1. Wąsowicz, Michał.
1. Winsławski, Bartłomiej.
1. Wiśniewski, Konrad.
1. Wiśniewski, Piotr.
1. Zdunek, Kamil.
1. Żarkowski, Mateusz.


## Ściąga z Gita

* Scott Chacon, [Pro Git](http://git-scm.com/book);
  [niekompletne tłumaczenie na język polski](http://git-scm.com/book/pl).

Dwa sposoby radzenia sobie z taką sytuacją:
**This pull request can be automatically merged**.

Sposób 1:

```sh
git remote add pjz90 git://github.com/pjz90/data-refine.git
git fetch pjz90
git merge pjz90/master
  .. edycja .. rozwiązywanie konfliktów
git remote rm pjz90
```

Sposób 2 (sugerowany przez GitHub Team):

```sh
git checkout -b bbedra-master master
git pull git://github.com/bbedra/data-refine.git master
git checkout master
git merge bbedra-master
git push origin master
git branch -d bedra-master
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
