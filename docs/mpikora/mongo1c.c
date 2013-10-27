#include <stdio.h>
#include "mongo.h"

#define MAXTAGSLEN 256

void PrintHelp(char* programname) {
	printf("Program rozbija pole tagi na jego poszczegolne skladowe i zapisuje je jako tablice napisow.\n");
	printf("Sposob uzycia:\n %s [nazwa_bazy_danych.nazwa_kolekcji] [opcje]\n",programname);
	printf("Dostepne opcje:\n-h\tWyswietla niniejsza pomoc.\n-l\tWyswietla szczegolowy log operacji.\n-c\tWyswietla ilosc zmienionych rekordow.\n");
}

int main (int argc, char *argv[]) {
	int log=0;
	int i=2;
	char temp[MAXTAGSLEN];
	char intstr[32];
	char delimiters[]=" ";
	char* token=NULL;
	bson new[1];
	const char* key;
	char* dbstring;
	int count=0;
	int countflag=0;
	
	// Obsluga argumentow
	if (argc<2) {
		PrintHelp(argv[0]);
		return 0;
	}
	else {
		dbstring=argv[1];
		while (i<argc && (argv[i][0] == '-')) {
			switch (argv[i][1]) {
				case 'h':
					PrintHelp(argv[0]);
					break;
				case 'l':
					log=1;
					break;
				case 'c':
					countflag=1;
			}
			i++;
		}
		
		// Laczenie z baza
		mongo conn[1];
		int status = mongo_client( conn, "127.0.0.1", 27017 );
		if (status != MONGO_OK) {
			switch ( conn->err ) {
			case MONGO_CONN_NO_SOCKET:  printf("Blad polaczenia z baza. no socket\n"); return 1;
			case MONGO_CONN_FAIL:       printf("Blad polaczenia z baza. connection failed\n"); return 1;
			case MONGO_CONN_NOT_MASTER: printf("Blad polaczenia z baza. not master\n" ); return 1;
			default: printf("Blad polaczenia z baza.\n" ); return 1;
			}
		}
	
		// Iterowanie po rekordach
		bson_iterator it[1];
		mongo_cursor cursor[1];
		mongo_cursor_init(cursor, conn, dbstring );
		while (mongo_cursor_next(cursor)==MONGO_OK) {
			if (log==1){
				printf("Przetwarzany rekord:\n");
				bson_print(&cursor->current);
			}
			bson_init(new);
			bson_iterator_init(it, &cursor->current);
		
			// Przepisz ID
			bson_iterator_next(it);
			key = bson_iterator_key(it);
			bson_append_int(new,key,bson_iterator_int(it));
		
			// Przepisz title
			bson_iterator_next(it);
			key = bson_iterator_key(it);
			bson_append_string(new,key,bson_iterator_string(it));
		
			// Przepisz body
			bson_iterator_next(it);
			key = bson_iterator_key(it);
			bson_append_string(new,key,bson_iterator_string(it));
		
			bson_iterator_next(it);
			key = bson_iterator_key(it);
			if (log==1) printf("Tagi w bazie: %s\n",bson_iterator_string(it));
			// Kopia tagow
			strncpy(temp, bson_iterator_string(it), MAXTAGSLEN);
			temp[MAXTAGSLEN-1]='\0';
			if (log==1) printf("Tagi w zmiennej tymczasowej: %s\n",temp);
		
			// Rozbicie tagow
			bson_append_start_array(new,key);
			i=0;
			sprintf(intstr,"%d",i);
			token=strtok(temp,delimiters);
			while (token != NULL) {
				if (log==1) printf("Wygenerowano token: %s\n",token);
				bson_append_string(new,intstr,token);
				i++;
				sprintf(intstr,"%d",i);
				token=strtok(NULL,delimiters);
			}
			bson_append_finish_array(new);
		
			if (bson_finish(new) != BSON_OK) {
				printf("Blad podczas tworzenia BSON-a.\n");
				return 1;
			}
			if (log==1) {
				printf("Nowy BSON:\n");
				bson_print(new);
			}
			if (mongo_update(conn, dbstring, &cursor->current, new, MONGO_UPDATE_BASIC, 0) != BSON_OK) {
				printf("Blad podczas updateowania rekordu.\n");
				return 1;
			}
			bson_destroy(new);
			count++;
			if (log==1) printf("\n");
		}
		if (countflag==1) printf("Zmieniono %i rekordow.\n",count);
		mongo_cursor_destroy(cursor);
		mongo_destroy(conn);
		return 0;
	}
}
