- prefix: @prefix oss: <https://data.vlaanderen.be/doc/implementatiemodel/ipdc-lpdc/ontwerpstandaard/2022-06-15#> .
- prefix: @prefix locn: <http://www.w3.org/ns/locn#> .
- shacl:path <https://www.w3.org/ns/locn#adminUnitL2> : ? should this not be ? shacl:path <http://www.w3.org/ns/locn#adminUnitL2>
- why shacl:closed false everywhere ? it allows any other field.
- prefix: @prefix adres: <https://data.vlaanderen.be/ns/adres#> .
- when in an example for a rdf:langString, specifying it via:

```
ex:someAddress
a locn:Address ;
adres:land "abc"@en .
```
we always get following error ... 
```
Message:
[]
Path:
NamedNode { value: 'https://data.vlaanderen.be/ns/adres#land' }
FocusNode:
NamedNode { value: 'http://example.com/ns#someAddress' }
Severity:
NamedNode { value: 'http://www.w3.org/ns/shacl#Violation' }
SourceConstraintComponent:
NamedNode {
value: 'http://www.w3.org/ns/shacl#ClassConstraintComponent'
}
SourceShape:
BlankNode { value: 'b2' }
```

when data type = xsd:string, then it rightly complains that "dd"@nl is not the correct datatype, but "data" is

======> 

shacl:class rdf:langString ===> shacl:datatype rdf:langString
shacl:class xsd:string ===> shacl:datatype xsd:string

... and others

- prefix: @prefix lpdcExt:  <https://productencatalogus.data.vlaanderen.be/ns/ipdc-lpdc#> .
- prefix: @prefix cpsv:	<http://purl.org/vocab/cpsv#> .
- prefix: @prefix m8g:	<http://data.europa.eu/m8g/> .
- shacl:class <http://fixme.com#URL>; ???  => (url): xsd:string ??
- prefix: @prefix pera: <http://publications.europa.eu/resource/authority/> .
- how to limit on the amount of language strings ?
  A definition like [
  shacl:datatype rdf:langString;
  shacl:description "This property represents the official Name of the Public Service."@nl;
  shacl:maxCount 1;
  shacl:minCount 1;
  shacl:name "name"@nl;
  shacl:path dc:title
  ] does not allow data like:
   ex:an-instance
  a lpdcExt:InstancePublicService ;
  dc:title """title-nl"""@nl ;
  dc:title """title-fr"""@fr ;
= > which is correctlty validated => how to allow multiple language strings ?
=> @see : https://www.w3.org/TR/shacl/#LanguageInConstraintComponent 
- and https://www.w3.org/TR/shacl/#UniqueLangConstraintComponent
- when validating a turtle file, and you for instance have a concept -> you have to provide this data as well in the turtle file (at least the type ...)
 otherwise it can not validate it ... (and gives a class type exception)
- In the LINK editor, you need to add all the ttl files used ... They then appear under External Libraries - some are already added by default. others custom ones you need to add.
  This allows proper navigation in the editor - AND - proper validation in the editor. Don't know how this works in the shacl library. How to add all these shape definition ttl's as well ?
- In the shapes loading in the typescript code, I think you need to add all the ontologies in the form of ttl files which are not standard libraries ...
- ask Dieter ipdc for the ontology of ipdc / lpdc contract (turtle representation https://data.vlaanderen.be/doc/implementatiemodel/ipdc-lpdc/)
- When validating chains of classes. e.g. 
 <http://data.lblod.info/id/bestuurseenheden/974816591f269bb7d74aa1720922651529f3d3b2a787f5c60b73e5a0384950a4>
  a besluit:Bestuurseenheid. 
  for which a a besluit:Bestuurseenheid. is defined to be a subclass of rdfs:subClassOf <http://data.europa.eu/m8g/PublicOrganisation> . (in m8g file)., and specified in the shacl shape
  ; we need ... only ... to include the besluit.ttl in the shapes AND merge all shapes also in the data (for this validator?)
  (because internally in the code, strangely the class validation logic happens on the context.$data graph instead of the context.$shapes graph) - which seems like a bug ?  Or a lack of understanding from our part.
-  
 
