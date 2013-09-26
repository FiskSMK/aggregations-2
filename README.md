# Agregacje 2

![Data Wranglers](/images/data-wrangler.jpg)

Należy przygotować 4–5 aggregacji.
Do aggregacji można wykorzystać swoje lub te kolekcje:

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

Po zalogowaniu powinniśmy wykonujemy kilka poleceń. Przykładowo:

```js
db                        // test
db.census1881.count()     // 4_277_807 rekordów
db.zipcodes.count()       //    29_467
db.kody_pocztowe.count()  //   140_076
db.imieniny.count()       //       364
db.airports.count()       //    44_980
db.census1881.findOne()
// {
//   "_id": ObjectId("51630b8b31f30759f2f32061"),
//   "last": "richard",
//   "first": "joseph",
//   "age": 40,
//   "religion": "catholic"
// }
```

*Uwaga:* Użytkownik *student* ma uprawnienia tylko do odczytu w bazie  *test*.


## Nasze agregacje

1. Włodzimierz Bzyl, [Imieniny](/docs/anon.md),
   [Open Street Map Data dla Polski](/docs/osm.md),
   [GeoBytes](/docs/geobytes.md) – państwa i miasta.
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –
1. –


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
